"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm, type Resolver } from "react-hook-form";
import { z } from "zod";

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
import { registerUser } from "@/services/auth.service";
import { cn } from "@/lib/utils";

const registrationSchema = z
  .object({
    name: z
      .string({ error: "নাম অবশ্যই দিতে হবে" })
      .trim()
      .min(2, "নাম কমপক্ষে ২ অক্ষরের হতে হবে"),
    email: z.string({ error: "ইমেইল অবশ্যই দিতে হবে" }).trim().email("সঠিক ইমেইল দিন"),
    phone: z
      .string()
      .trim()
      .optional()
      .or(z.literal("")),
    password: z
      .string({ error: "পাসওয়ার্ড অবশ্যই দিতে হবে" })
      .min(8, "পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
    confirmPassword: z
      .string({ error: "কনফার্ম পাসওয়ার্ড দিন" })
      .min(8, "কনফার্ম পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে"),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "পাসওয়ার্ড দুটি মিলছে না",
    path: ["confirmPassword"],
  });

type RegistrationFormValues = z.infer<typeof registrationSchema>;

const createZodResolver = <TFieldValues extends RegistrationFormValues>(
  schema: typeof registrationSchema,
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

export default function RegistrationForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegistrationFormValues>({
    resolver: createZodResolver(registrationSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: RegistrationFormValues) => {
    setServerError("");
    setIsSubmitting(true);

    try {
      const response = await registerUser({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        phone: values.phone?.trim() || undefined,
        password: values.password,
      });

      toast.success(response.message || "Registration successful", {
        position: "top-right",
      });

      reset();
      router.push("/login");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
      setServerError(message);
      toast.error(message, {
        position: "top-right",
      });
    } finally {
      setIsSubmitting(false);
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
                  অ্যাকাউন্ট খুলুন
                </h1>
                <p className="text-sm text-muted-foreground">
                  আপনার তথ্য দিয়ে সহজে রেজিস্ট্রেশন করুন এবং অর্ডার শুরু করুন
                </p>
              </div>

              {serverError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-center text-sm font-medium text-red-600 dark:border-red-900 dark:bg-red-950/30">
                  {serverError}
                </div>
              )}

              <Field>
                <FieldLabel htmlFor="name">নাম</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="আপনার পূর্ণ নাম"
                  autoComplete="name"
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-sm text-red-500">{errors.name.message}</p>
                )}
              </Field>

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
                <FieldLabel htmlFor="phone">ফোন নম্বর</FieldLabel>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="ঐচ্ছিক"
                  autoComplete="tel"
                  {...register("phone")}
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="password">পাসওয়ার্ড</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="কমপক্ষে ৮ অক্ষর"
                    autoComplete="new-password"
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

              <Field>
                <FieldLabel htmlFor="confirmPassword">পাসওয়ার্ড নিশ্চিত করুন</FieldLabel>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="আবার পাসওয়ার্ড দিন"
                  autoComplete="new-password"
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                )}
              </Field>

              <Field>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full cursor-pointer items-center justify-center gap-2 bg-primary py-4 font-semibold text-primary-foreground hover:bg-primary/90"
                >
                  {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  {isSubmitting ? "রেজিস্ট্রেশন হচ্ছে..." : "রেজিস্ট্রেশন করুন"}
                </Button>
              </Field>

              <FieldSeparator className="my-2">
                অথবা লগইন করুন
              </FieldSeparator>

              <FieldDescription className="text-center text-sm">
                ইতিমধ্যে অ্যাকাউন্ট আছে?{" "}
                <Link href="/login" className="font-semibold text-primary hover:underline">
                  লগইন করুন
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="relative hidden items-center justify-center bg-gradient-to-br from-rose-50/50 to-pink-100/50 p-8 text-center dark:from-slate-900/60 dark:to-rose-950/30 md:flex">
            <div className="flex max-w-md flex-col items-center space-y-6">
              <Image
                src="/assets/PerfectGiftsStation.png"
                alt="Perfect Gifts Station Logo"
                width={80}
                height={80}
              />

              <div className="space-y-2">
                <h2 className="text-sm font-bold tracking-tight text-foreground sm:text-xl">
                  সুন্দর গিফটের জন্য
                  <span className="mt-1 block text-primary">একটি প্রোফাইল তৈরি করুন</span>
                </h2>
              </div>

              <p className="text-sm leading-relaxed text-muted-foreground">
                আপনার তথ্য সুরক্ষিত থাকবে এবং রেজিস্ট্রেশনের পরে সহজেই অর্ডার, ইনকোয়ারি
                ও কাস্টম অর্ডার শুরু করতে পারবেন।
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
