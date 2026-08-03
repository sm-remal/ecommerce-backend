"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/services/auth.service";
import { cn } from "@/lib/utils";
import { setStoredAuthUser } from "@/lib/auth-storage";

const loginSchema = z.object({
  email: z.string({ error: "ইমেইল অবশ্যই দিতে হবে" }).trim().email("সঠিক ইমেইল দিন"),
  password: z
    .string({ error: "পাসওয়ার্ড অবশ্যই দিতে হবে" })
    .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const createZodResolver = <TFieldValues extends LoginFormValues>(
  schema: typeof loginSchema,
): Resolver<TFieldValues> => {
  return async (values) => {
    const parsed = schema.safeParse(values);

    if (parsed.success) {
      return {
        values: parsed.data as TFieldValues,
        errors: {},
      };
    }

    const fieldErrors: Record<string, { type: string; message: string }> = {};

    parsed.error.issues.forEach((issue) => {
      const fieldName = issue.path[0];

      if (typeof fieldName === "string" && !fieldErrors[fieldName]) {
        fieldErrors[fieldName] = {
          type: "manual",
          message: issue.message,
        };
      }
    });

    return {
      values: {} as TFieldValues,
      errors: fieldErrors as never,
    };
  };
};

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LoginFormValues>({
    resolver: createZodResolver(loginSchema),
    mode: "onTouched",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });

      if (response.data?.user) {
        setStoredAuthUser(response.data.user);
      }

      toast.success("Login successful!", { position: "top-right" });
      reset();
      router.push("/");
    } catch (err) {
      const message = err instanceof Error ? err.message : "লগইন করতে সমস্যা হচ্ছে। আবার চেষ্টা করুন।";
      setError(message);
      toast.error(message, { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden border-none p-0 shadow-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col justify-center bg-card p-6 md:p-12"
          >
            <FieldGroup>
              <div className="mb-2 flex flex-col items-center gap-1.5 text-center">
                <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  স্বাগতম!
                </h1>
                <p className="text-sm text-muted-foreground">
                  আপনার অ্যাকাউন্টে লগইন করে সেরা গিফট নির্বাচন করুন
                </p>
              </div>

              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-500 dark:border-red-900 dark:bg-red-950/30">
                  {error}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="email">ইমেইল ঠিকানা</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="আপনার ইমেইল লিখুন"
                  autoComplete="email"
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">পাসওয়ার্ড</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="আপনার পাসওয়ার্ড দিন"
                    autoComplete="current-password"
                    className="pr-10"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </Field>

              <div className="flex items-center justify-between text-sm">
                <label className="flex cursor-pointer items-center gap-2 text-muted-foreground transition-colors hover:text-foreground">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
                  />
                  মনে রাখুন
                </label>
                <a href="#" className="text-sm font-medium text-primary hover:underline">
                  পাসওয়ার্ড ভুলে গেছেন?
                </a>
              </div>

              <Field>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 bg-primary py-4 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {loading ? "লগইন হচ্ছে..." : "লগইন করুন"}
                </Button>
              </Field>

              <FieldSeparator className="my-2">
                অথবা অন্যভাবে প্রবেশ করুন
              </FieldSeparator>

              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => signIn("google")}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 font-medium"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google দিয়ে সাইন ইন করুন
                </Button>
              </Field>

              <FieldDescription className="text-center text-sm">
                নতুন একাউন্ট খুলতে চান?{" "}
                <a href="/registration" className="font-semibold text-primary hover:underline">
                  রেজিস্ট্রেশন করুন
                </a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden flex-col items-center justify-center bg-gradient-to-br from-rose-50/50 to-pink-100/50 p-8 text-center md:flex dark:from-slate-900/60 dark:to-rose-950/30">
            <div className="flex max-w-md flex-col items-center space-y-6">
              <Image
                src="/assets/PerfectGiftsStation.png"
                alt="Perfect Gifts Station Logo"
                width={80}
                height={80}
              />

              <div className="space-y-2">
                <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-xl">
                  প্রিয়জনের জন্য মনে রাখার মতো{" "}
                  <span className="mt-1 block text-primary">উপহার খুঁজছেন?</span>
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                Perfect Gifts Station-এ পাবেন যত্ন নিয়ে বাছাই করা, প্রিমিয়াম
                কোয়ালিটির গিফট আইটেম, আপনার প্রতিটি বিশেষ মুহূর্ত ও উপলক্ষকে
                স্মরণীয় করে রাখতে।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
