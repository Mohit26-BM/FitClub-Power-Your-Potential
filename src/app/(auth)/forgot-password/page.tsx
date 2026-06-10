"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Dumbbell, KeyRound } from "lucide-react";
import { forgotPasswordSchema, type ForgotPasswordInput } from "@/lib/validations";
import { requestPasswordReset } from "@/actions/auth.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ForgotPasswordPage() {
  const [result, setResult] = useState<{ token: string; name: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  async function onSubmit(data: ForgotPasswordInput) {
    const res = await requestPasswordReset(data);

    if (res?.error) {
      const fieldErrors = res.error as Record<string, string[]>;
      (Object.keys(fieldErrors) as Array<keyof ForgotPasswordInput>).forEach((key) => {
        if (fieldErrors[key]?.length) {
          setError(key, { message: fieldErrors[key][0] });
        }
      });
      return;
    }

    if (res?.success && res.token && res.name) {
      setResult({ token: res.token, name: res.name });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
            <Dumbbell className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot Password</h1>
          <p className="text-slate-400 text-sm mt-1">Reset your FitClub account password</p>
        </div>

        {!result ? (
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5 shadow-xl"
          >
            <p className="text-slate-400 text-sm">
              Enter your Member ID and registered mobile number to receive a reset code.
            </p>

            <Input
              label="Member ID"
              placeholder="e.g. M001"
              error={errors.memberId?.message}
              {...register("memberId")}
            />

            <Input
              label="Mobile Number"
              placeholder="10–13 digit mobile number"
              error={errors.mobile?.message}
              {...register("mobile")}
            />

            <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
              Get Reset Code
            </Button>
          </form>
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                <KeyRound className="text-emerald-400" size={20} />
              </div>
              <div>
                <p className="text-white font-semibold">Reset Code Generated</p>
                <p className="text-slate-400 text-xs">Hello, {result.name}</p>
              </div>
            </div>

            <div className="bg-slate-800 border border-emerald-500/30 rounded-xl p-6 mb-6 text-center">
              <p className="text-slate-400 text-xs mb-2 uppercase tracking-wider">Your Reset Code</p>
              <p className="text-4xl font-mono font-bold text-emerald-400 tracking-widest">
                {result.token}
              </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 mb-6">
              <p className="text-yellow-300 text-xs">
                This code expires in <span className="font-semibold">30 minutes</span>. Use it on the reset page.
              </p>
            </div>

            <p className="text-slate-500 text-xs mb-6 text-center">
              In a production system, this code would be sent via SMS to your registered mobile number.
            </p>

            <Link
              href="/reset-password"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
            >
              Use this code →
            </Link>
          </div>
        )}

        <p className="text-center text-slate-500 text-xs mt-4">
          Remember your password?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
