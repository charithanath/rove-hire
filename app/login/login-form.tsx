"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchema, type LoginInput } from "@/lib/validations";

interface LoginFormProps {
  callbackUrl: string;
  serverError?: string;
}

// Auth.js error codes → human-readable messages
const ERROR_MESSAGES: Record<string, string> = {
  CredentialsSignin: "Incorrect email or password.",
  Default: "Something went wrong. Please try again.",
};

export function LoginForm({ callbackUrl, serverError }: LoginFormProps) {
  const router = useRouter();
  const [submitError, setSubmitError] = useState<string | null>(
    serverError ? (ERROR_MESSAGES[serverError] ?? ERROR_MESSAGES.Default) : null
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginInput) {
    setSubmitError(null);

    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false, // Handle redirect manually so we can show errors
    });

    if (result?.error) {
      setSubmitError(ERROR_MESSAGES.CredentialsSignin);
      return;
    }

    // Successful sign-in — hard navigate so the server session is fresh
    router.push(callbackUrl);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="flex flex-col gap-4">
      <Input
        label="Email address"
        type="email"
        autoComplete="email"
        placeholder="hr@rovehire.com"
        required
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label="Password"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        required
        error={errors.password?.message}
        {...register("password")}
      />

      {submitError && (
        <div
          className="rounded-md bg-danger/10 border border-danger/20 px-3 py-2.5 text-sm text-danger"
          role="alert"
        >
          {submitError}
        </div>
      )}

      <Button
        type="submit"
        loading={isSubmitting}
        className="w-full mt-1"
      >
        Sign in
      </Button>
    </form>
  );
}
