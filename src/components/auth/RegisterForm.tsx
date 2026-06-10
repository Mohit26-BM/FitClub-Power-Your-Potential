"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { CheckCircle, Dumbbell, Eye, EyeOff } from "lucide-react";
import { registerSchema, type RegisterInput } from "@/lib/validations";
import { registerMember } from "@/actions/member.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { PLAN_LABELS, PLAN_FEES, type Plan } from "@/types";
import { formatCurrency } from "@/lib/utils";

export default function RegisterForm() {
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState<{ memberId: string; plan: string } | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const selectedPlan = watch("plan");

  async function onSubmit(data: RegisterInput) {
    setServerError(null);
    const result = await registerMember(data);

    if (result?.error) {
      const fieldErrors = result.error as Record<string, string[]>;
      let handled = false;
      (Object.keys(fieldErrors) as Array<keyof RegisterInput>).forEach((key) => {
        if (fieldErrors[key]?.length) {
          setError(key, { message: fieldErrors[key][0] });
          handled = true;
        }
      });
      if (!handled) setServerError("Registration failed. Please try again.");
      return;
    }

    setSuccess({ memberId: data.memberId, plan: data.plan });
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
        <div className="w-full max-w-md">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-xl text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
              <CheckCircle className="text-emerald-400" size={32} />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-slate-400 text-sm mb-6">Your FitClub account has been created.</p>

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-4 mb-6 text-left space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Member ID</span>
                <span className="text-emerald-400 font-mono font-semibold">{success.memberId}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Plan</span>
                <span className="text-white font-medium">{PLAN_LABELS[success.plan as Plan]}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-sm">Fee Due</span>
                <span className="text-yellow-400 font-medium">{formatCurrency(PLAN_FEES[success.plan as Plan])}</span>
              </div>
            </div>

            <p className="text-slate-500 text-xs mb-6">
              Please visit the gym desk to complete your fee payment and activate your membership.
            </p>

            <Link
              href="/login"
              className="block w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors text-center"
            >
              Sign In to Your Account →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl mb-4">
            <Dumbbell className="text-emerald-400" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Join FitClub</h1>
          <p className="text-slate-400 text-sm mt-1">Create your member account</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-5 shadow-xl"
        >
          <Input
            label="Full Name"
            placeholder="Your full name"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Member ID"
            placeholder="e.g. M001"
            hint="Letters, numbers, hyphens, underscores (3–15 chars)"
            error={errors.memberId?.message}
            {...register("memberId")}
          />

          <Input
            label="Mobile Number"
            placeholder="10–13 digit mobile number"
            error={errors.mobile?.message}
            {...register("mobile")}
          />

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              BMI
            </label>
            <input
              type="number"
              step="0.1"
              min={10}
              max={60}
              placeholder="e.g. 22.5"
              className="w-full rounded-lg bg-slate-800 border border-slate-600 hover:border-slate-500 px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              {...register("bmi", { valueAsNumber: true })}
            />
            {errors.bmi && (
              <p className="mt-1 text-xs text-red-400">{errors.bmi.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Membership Plan
            </label>
            <select
              className="w-full rounded-lg bg-slate-800 border border-slate-600 hover:border-slate-500 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
              {...register("plan")}
            >
              <option value="">Select a plan</option>
              {(["MONTHLY", "QUARTERLY", "ANNUAL"] as Plan[]).map((plan) => (
                <option key={plan} value={plan}>
                  {PLAN_LABELS[plan]} — {formatCurrency(PLAN_FEES[plan])}
                </option>
              ))}
            </select>
            {errors.plan && (
              <p className="mt-1 text-xs text-red-400">{errors.plan.message}</p>
            )}
            {selectedPlan && (
              <p className="mt-1 text-xs text-emerald-400">
                Fee due at gym desk: {formatCurrency(PLAN_FEES[selectedPlan as Plan])}
              </p>
            )}
          </div>

          <div className="relative">
            <Input
              label="Password"
              type={showPw ? "text" : "password"}
              placeholder="••••••••"
              error={errors.password?.message}
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPw(!showPw)}
              className="absolute right-3 top-9 text-slate-500 hover:text-slate-300 transition-colors"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-xs text-slate-500 -mt-2 space-y-0.5">
            <p>Password requirements: 8+ characters, uppercase, lowercase, number, special character</p>
          </div>

          <div className="relative">
            <Input
              label="Confirm Password"
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

          {serverError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
              {serverError}
            </div>
          )}

          <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
            Create Account
          </Button>
        </form>

        <p className="text-center text-slate-500 text-xs mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-emerald-400 hover:underline">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
}
