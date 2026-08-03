import net from "node:net";
import tls from "node:tls";
import config from "../config";

type EmailAddress = string | string[];

export type SendEmailOptions = {
    to: EmailAddress;
    subject: string;
    text?: string;
    html?: string;
    replyTo?: string;
};

type SmtpConfig = {
    host: string;
    port: number;
    user: string;
    password: string;
    from: string;
    secure: boolean;
};

const defaultTimeoutMs = 15000;

const normalizeRecipients = (value: EmailAddress) => Array.isArray(value) ? value : [value];

const getSmtpConfig = (): SmtpConfig | null => {
    const host = config.smtp_host;
    const user = config.smtp_user;
    const password = config.smtp_password;
    const from = config.email_from || user;

    if (!host || !user || !password || !from) {
        return null;
    }

    const port = Number(config.smtp_port || 587);
    const secure = String(config.smtp_secure || "").toLowerCase() === "true" || port === 465;

    return {
        host,
        port,
        user,
        password,
        from,
        secure,
    };
};

export const isEmailConfigured = () => Boolean(getSmtpConfig());

const encodeBase64 = (value: string) => Buffer.from(value).toString("base64");

const sanitizeHeader = (value: string) => value.replace(/[\r\n]+/g, " ").trim();

const formatAddressList = (value: EmailAddress) => normalizeRecipients(value)
    .map((address) => `<${sanitizeHeader(address)}>`)
    .join(", ");

const escapeSmtpData = (message: string) => message
    .replace(/\r?\n/g, "\r\n")
    .replace(/^\./gm, "..");

const buildEmailMessage = (options: SendEmailOptions, smtpConfig: SmtpConfig) => {
    const boundary = `pgs-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    const text = options.text || options.html?.replace(/<[^>]+>/g, " ") || "";
    const html = options.html || `<pre>${text}</pre>`;

    return [
        `From: ${sanitizeHeader(smtpConfig.from)}`,
        `To: ${formatAddressList(options.to)}`,
        `Subject: ${sanitizeHeader(options.subject)}`,
        ...(options.replyTo ? [`Reply-To: ${sanitizeHeader(options.replyTo)}`] : []),
        "MIME-Version: 1.0",
        `Content-Type: multipart/alternative; boundary="${boundary}"`,
        "",
        `--${boundary}`,
        "Content-Type: text/plain; charset=utf-8",
        "Content-Transfer-Encoding: 8bit",
        "",
        text,
        "",
        `--${boundary}`,
        "Content-Type: text/html; charset=utf-8",
        "Content-Transfer-Encoding: 8bit",
        "",
        html,
        "",
        `--${boundary}--`,
    ].join("\r\n");
};

class SmtpConnection {
    private socket: net.Socket | tls.TLSSocket;
    private buffer = "";

    constructor(private readonly smtpConfig: SmtpConfig) {
        this.socket = smtpConfig.secure
            ? tls.connect({ host: smtpConfig.host, port: smtpConfig.port, servername: smtpConfig.host })
            : net.connect({ host: smtpConfig.host, port: smtpConfig.port });

        this.socket.setEncoding("utf8");
        this.socket.setTimeout(defaultTimeoutMs);
        this.socket.on("data", (chunk) => {
            this.buffer += chunk;
        });
    }

    private waitForResponse = async () => new Promise<string>((resolve, reject) => {
        const cleanup = () => {
            clearTimeout(timer);
            this.socket.off("data", onData);
            this.socket.off("error", onError);
            this.socket.off("timeout", onTimeout);
        };

        const getCompleteResponse = () => {
            const lines = this.buffer.split(/\r?\n/).filter(Boolean);
            const lastLine = lines[lines.length - 1];

            if (lastLine && /^\d{3} /.test(lastLine)) {
                const response = this.buffer;
                this.buffer = "";
                return response;
            }

            return null;
        };

        const onData = () => {
            const response = getCompleteResponse();

            if (response) {
                cleanup();
                resolve(response);
            }
        };

        const onError = (error: Error) => {
            cleanup();
            reject(error);
        };

        const onTimeout = () => {
            cleanup();
            reject(new Error("SMTP connection timed out"));
        };

        const timer = setTimeout(onTimeout, defaultTimeoutMs);
        this.socket.on("data", onData);
        this.socket.once("error", onError);
        this.socket.once("timeout", onTimeout);
        onData();
    });

    private expect = async (allowedCodes: number[]) => {
        const response = await this.waitForResponse();
        const code = Number(response.slice(0, 3));

        if (!allowedCodes.includes(code)) {
            throw new Error(`SMTP error: ${response.trim()}`);
        }

        return response;
    };

    private command = async (command: string, allowedCodes: number[]) => {
        this.socket.write(`${command}\r\n`);
        return this.expect(allowedCodes);
    };

    private upgradeToTls = async () => new Promise<void>((resolve, reject) => {
        const secureSocket = tls.connect({
            socket: this.socket,
            servername: this.smtpConfig.host,
        }, () => {
            this.socket = secureSocket;
            this.socket.setEncoding("utf8");
            this.socket.setTimeout(defaultTimeoutMs);
            this.socket.on("data", (chunk) => {
                this.buffer += chunk;
            });
            resolve();
        });

        secureSocket.once("error", reject);
    });

    send = async (options: SendEmailOptions) => {
        await this.expect([220]);
        await this.command(`EHLO ${this.smtpConfig.host}`, [250]);

        if (!this.smtpConfig.secure) {
            await this.command("STARTTLS", [220]);
            await this.upgradeToTls();
            await this.command(`EHLO ${this.smtpConfig.host}`, [250]);
        }

        await this.command("AUTH LOGIN", [334]);
        await this.command(encodeBase64(this.smtpConfig.user), [334]);
        await this.command(encodeBase64(this.smtpConfig.password), [235]);
        await this.command(`MAIL FROM:<${this.smtpConfig.from}>`, [250]);

        for (const recipient of normalizeRecipients(options.to)) {
            await this.command(`RCPT TO:<${recipient}>`, [250, 251]);
        }

        await this.command("DATA", [354]);
        this.socket.write(`${escapeSmtpData(buildEmailMessage(options, this.smtpConfig))}\r\n.\r\n`);
        await this.expect([250]);
        await this.command("QUIT", [221]);
    };

    close = () => {
        this.socket.end();
    };
}

export const sendEmail = async (options: SendEmailOptions) => {
    const smtpConfig = getSmtpConfig();

    if (!smtpConfig) {
        throw new Error("SMTP email is not configured");
    }

    const connection = new SmtpConnection(smtpConfig);

    try {
        await connection.send(options);
    } finally {
        connection.close();
    }
};

export const sendEmailSafely = async (options: SendEmailOptions) => {
    if (!isEmailConfigured()) {
        return { sent: false, skipped: true };
    }

    try {
        await sendEmail(options);
        return { sent: true, skipped: false };
    } catch (error) {
        console.error("Email sending failed", error);
        return { sent: false, skipped: false };
    }
};
