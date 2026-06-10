"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addMemberSchema, type AddMemberInput } from "@/lib/validations";
import { addMember } from "@/actions/member.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

const PLAN_OPTIONS = [
  { value: "MONTHLY",   label: "Monthly — ₹3,000 / month" },
  { value: "QUARTERLY", label: "Quarterly — ₹8,000 / 3 months" },
  { value: "ANNUAL",    label: "Annual — ₹28,000 / year" },
];

type FieldErrors = Partial<Record<keyof AddMemberInput, string[]>>;

export default function AddMemberForm() {
  const router = useRouter();
  const [showPw, setShowPw]   = useState(false);
  const [showCp, setShowCp]   = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverErrors, setServerErrors] = useState<FieldErrors>({});

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddMemberInput>({
    resolver: zodResolver(addMemberSchema),
    defaultValues: { plan: "MONTHLY", joinDate: new Date().toISOString().split("T")[0] },
  });

  async function onSubmit(data: AddMemberInput) {
    setServerErrors({});
    const result = await addMember(data);

    if (result.error && typeof result.error === "object") {
      setServerErrors(result.error as FieldErrors);
      return;
    }
    if (result.error) {
      setServerErrors({ memberId: [result.error as string] });
      return;
    }

    setSuccess(true);
    reset();
    setTimeout(() => {
      setSuccess(false);
      router.push("/admin/members");
    }, 1500);
  }

  const fe = (field: keyof AddMemberInput) =>
    errors[field]?.message ?? serverErrors[field]?.[0];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-4 text-emerald-400 text-sm">
          Member added successfully! Redirecting…
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="John Doe" error={fe("name")} {...register("name")} />
        <Input label="Member ID" placeholder="M001" error={fe("memberId")} {...register("memberId")} hint="Unique, alphanumeric" />
        <Input label="Mobile Number" placeholder="9876543210" error={fe("mobile")} {...register("mobile")} hint="10-13 digits" />

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">BMI</label>
          <input
            type="number"
            step="0.1"
            min={10}
            max={60}
            placeholder="22.5"
            className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            {...register("bmi", { valueAsNumber: true })}
          />
          {fe("bmi") && <p className="mt-1 text-xs text-red-400">{fe("bmi")}</p>}
        </div>

        <Input
          label="Join Date"
          type="date"
          error={fe("joinDate")}
          {...register("joinDate")}
        />

        <Select label="Membership Plan" options={PLAN_OPTIONS} error={fe("plan")} {...register("plan")} />

        <div className="relative">
          <Input
            label="Password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••"
            error={fe("password")}
            {...register("password")}
          />
          <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
            {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showCp ? "text" : "password"}
            placeholder="••••••••"
            error={fe("confirmPassword")}
            {...register("confirmPassword")}
          />
          <button type="button" aria-label={showCp ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowCp(!showCp)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
            {showCp ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 text-xs text-slate-400">
        <p className="font-medium text-slate-300 mb-1">Password requirements:</p>
        <ul className="space-y-0.5 list-disc list-inside">
          <li>Minimum 8 characters</li>
          <li>At least one uppercase letter (A-Z)</li>
          <li>At least one lowercase letter (a-z)</li>
          <li>At least one number (0-9)</li>
          <li>At least one special character (!@#$%…)</li>
        </ul>
      </div>

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={isSubmitting}>
          Add Member
        </Button>
      </div>
    </form>
  );
}
