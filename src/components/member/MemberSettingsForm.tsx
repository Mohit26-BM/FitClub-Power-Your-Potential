"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateProfileSchema, changePasswordSchema,
  type UpdateProfileInput, type ChangePasswordInput,
} from "@/lib/validations";
import { updateMemberProfile, changeMemberPassword } from "@/actions/member.actions";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { Eye, EyeOff } from "lucide-react";

interface Msg { type: "success" | "error"; text: string }

interface Props {
  mobile: string;
  bmi: number;
}

export default function MemberSettingsForm({ mobile, bmi }: Props) {
  const [profileMsg, setProfileMsg]  = useState<Msg | null>(null);
  const [pwMsg, setPwMsg]            = useState<Msg | null>(null);
  const [showFields, setShowFields]  = useState({ cur: false, np: false, cp: false });

  const profileForm = useForm<UpdateProfileInput>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: { mobile, bmi },
  });

  const pwForm = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
  });

  async function onProfile(data: UpdateProfileInput) {
    setProfileMsg(null);
    const result = await updateMemberProfile(data);
    if (result.success) setProfileMsg({ type: "success", text: "Profile updated successfully." });
    else setProfileMsg({ type: "error", text: "Failed to update profile." });
  }

  async function onPw(data: ChangePasswordInput) {
    setPwMsg(null);
    const result = await changeMemberPassword(data);
    if (result.success) {
      setPwMsg({ type: "success", text: "Password changed successfully." });
      pwForm.reset();
    } else if (typeof result.error === "object") {
      const e = result.error as Record<string, string[]>;
      setPwMsg({ type: "error", text: Object.values(e).flat()[0] ?? "Failed." });
    } else {
      setPwMsg({ type: "error", text: result.error as string });
    }
  }

  const toggle = (field: keyof typeof showFields) =>
    setShowFields((p) => ({ ...p, [field]: !p[field] }));

  return (
    <div className="space-y-8 max-w-lg">
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Update Profile</h2>
        <form onSubmit={profileForm.handleSubmit(onProfile)} className="space-y-4">
          <Input
            label="Mobile Number"
            placeholder="9876543210"
            error={profileForm.formState.errors.mobile?.message}
            {...profileForm.register("mobile")}
          />
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">BMI</label>
            <input
              type="number"
              step="0.1"
              min={10}
              max={60}
              className="w-full rounded-lg bg-slate-800 border border-slate-600 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              {...profileForm.register("bmi", { valueAsNumber: true })}
            />
            {profileForm.formState.errors.bmi && (
              <p className="mt-1 text-xs text-red-400">{profileForm.formState.errors.bmi.message}</p>
            )}
          </div>
          {profileMsg && (
            <div className={`rounded-lg p-3 text-sm ${profileMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
              {profileMsg.text}
            </div>
          )}
          <Button type="submit" loading={profileForm.formState.isSubmitting}>Save Profile</Button>
        </form>
      </section>

      <div className="border-t border-slate-700" />

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">Change Password</h2>
        <form onSubmit={pwForm.handleSubmit(onPw)} className="space-y-4">
          <div className="relative">
            <Input label="Current Password" type={showFields.cur ? "text" : "password"} placeholder="••••••••" error={pwForm.formState.errors.currentPassword?.message} {...pwForm.register("currentPassword")} />
            <button type="button" onClick={() => toggle("cur")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
              {showFields.cur ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="relative">
            <Input label="New Password" type={showFields.np ? "text" : "password"} placeholder="••••••••" error={pwForm.formState.errors.newPassword?.message} {...pwForm.register("newPassword")} />
            <button type="button" onClick={() => toggle("np")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
              {showFields.np ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="relative">
            <Input label="Confirm New Password" type={showFields.cp ? "text" : "password"} placeholder="••••••••" error={pwForm.formState.errors.confirmPassword?.message} {...pwForm.register("confirmPassword")} />
            <button type="button" onClick={() => toggle("cp")} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300">
              {showFields.cp ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3 text-xs text-slate-400">
            8+ chars · uppercase · lowercase · number · special character
          </div>
          {pwMsg && (
            <div className={`rounded-lg p-3 text-sm ${pwMsg.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"}`}>
              {pwMsg.text}
            </div>
          )}
          <Button type="submit" loading={pwForm.formState.isSubmitting}>Change Password</Button>
        </form>
      </section>
    </div>
  );
}
