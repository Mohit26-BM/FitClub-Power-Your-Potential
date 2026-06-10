"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminPasswordSchema, type AdminPasswordInput } from "@/lib/validations";
import { changeAdminPassword } from "@/actions/admin.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function AdminSettingsForm() {
  const [showFields, setShowFields] = useState({ cur: false, np: false, cp: false });
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AdminPasswordInput>({ resolver: zodResolver(adminPasswordSchema) });

  async function onSubmit(data: AdminPasswordInput) {
    setMsg(null);
    const result = await changeAdminPassword(data);
    if (result.success) {
      setMsg({ type: "success", text: "Admin password changed successfully." });
      reset();
    } else if (typeof result.error === "object") {
      const errs = result.error as Record<string, string[]>;
      setMsg({ type: "error", text: Object.values(errs).flat()[0] ?? "Failed." });
    } else {
      setMsg({ type: "error", text: result.error as string });
    }
  }

  const toggle = (field: keyof typeof showFields) =>
    setShowFields((p) => ({ ...p, [field]: !p[field] }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 max-w-md">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center">
          <ShieldCheck className="text-emerald-400" size={20} />
        </div>
        <div>
          <p className="text-white font-semibold">Admin Password</p>
          <p className="text-slate-400 text-xs">Change your admin account password.</p>
        </div>
      </div>

      <div className="relative">
        <Input label="Current Password" type={showFields.cur ? "text" : "password"} placeholder="••••••••" error={errors.currentPassword?.message} {...register("currentPassword")} />
        <button type="button" onClick={() => toggle("cur")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
          {showFields.cur ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative">
        <Input label="New Password" type={showFields.np ? "text" : "password"} placeholder="••••••••" error={errors.newPassword?.message} {...register("newPassword")} />
        <button type="button" onClick={() => toggle("np")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
          {showFields.np ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="relative">
        <Input label="Confirm New Password" type={showFields.cp ? "text" : "password"} placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
        <button type="button" onClick={() => toggle("cp")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
          {showFields.cp ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
        Password must be 8+ characters with uppercase, lowercase, number and special character.
      </div>

      {msg && (
        <div className={`rounded-lg p-3 text-sm ${msg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
          {msg.text}
        </div>
      )}

      <Button type="submit" loading={isSubmitting}>Update Password</Button>
    </form>
  );
}
