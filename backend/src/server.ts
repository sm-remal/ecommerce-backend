import app from "./app";
import config from "./config";
import { prisma } from "./lib/prisma";

const port = config.port;
let server: ReturnType<typeof app.listen> | undefined;

const shutdown = async (signal: string) => {
    try {
        console.log(`${signal} received. Shutting down server...`);

        if (server) {
            server.close();
        }

        await prisma.$disconnect();
        console.log("Prisma disconnected from the database successfully");
        process.exit(0);
    } catch (error) {
        console.log(`Error during shutdown ${error}`);
        process.exit(1);
    }
};

const main = async () => {
    try {
        await prisma.$connect();
        console.log("Prisma connected to the database successfully");

        server = app.listen(port, () => {
            console.log(`Server is running on ${port}`)
        })
    } catch (error) {
        console.log(`Error Starting The Server ${error}`)
        await prisma.$disconnect();
        process.exit(1);
    }
}

process.on("SIGINT", () => {
    void shutdown("SIGINT");
});

process.on("SIGTERM", () => {
    void shutdown("SIGTERM");
});

main()
