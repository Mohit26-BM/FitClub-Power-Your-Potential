"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle, Dumbbell, Eye, EyeOff } from "lucide-react";
import { tokenResetSchema, type TokenResetInput } from "@/lib/validations";
import { resetPasswordWithToken } from "@/actions/auth.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

export default function ResetPasswordPage() {
  const [done, setDone] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<TokenResetInput>({
    resolver: zodResolver(tokenResetSchema),
  });

  async function onSubmit(data: TokenResetInput) {
    const res = await resetPasswordWithToken(data);

    if (res?.error) {
      const fieldErrors = res.error as Record<string, string[]>;
      (Object.keys(fieldErrors) as Array<keyof TokenResetInput>).forEach((key) => {
        if (fieldErrors[key]?.length) {
          setError(key, { message: fieldErrors[key][0] });
        }
      });
      return;
    }

    if (res?.success) {
      setDone(true);
    }
  }

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Password Reset!</h2>
            <p className="text-slate-400 text-sm mb-6">
              Your password has been successfully reset. You can now sign in with your new password.
            </p>
            <Link
              href="/login"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
            <Dumbbell className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Reset Password</h1>
          <p className="text-slate-400 text-sm mt-1">Enter your reset code and new password</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5 shadow-xl"
        >
          <Input
            label="Member ID"
            placeholder="e.g. M001"
            error={errors.memberId?.message}
            {...register("memberId")}
          />

          <Input
            label="Reset Code"
            placeholder="6-digit code"
            maxLength={6}
            error={errors.token?.message}
            hint="Enter the 6-digit code from the previous step"
            {...register("token")}
          />

          <div className="relative">
            <Input
              label="New Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              error={errors.newPassword?.message}
              {...register("newPassword")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-xs text-slate-500 -mt-2">
            <p>8+ characters, uppercase, lowercase, number, special character</p>
          </div>

          <div className="relative">
            <Input
              label="Confirm New Password"
              type={showConfirm ? "text" : "password"}
              placeholder="••••••••"
              error={errors.confirmPassword?.message}
              {...register("confirmPassword")}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Reset Password
          </Button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-4">
          Need a reset code?{" "}
          <Link href="/forgot-password" className="text-emerald-400 hover:underline">
            Get one here
          </Link>
        </p>
      </div>
    </div>
  );
}
