"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import { toggleFeeStatus, deleteMember, adminResetMemberPassword } from "@/actions/member.actions";
import { bookSlot, cancelBooking } from "@/actions/slot.actions";
import { isExpired, formatDate, formatCurrency } from "@/lib/utils";
import { getBmiCategory, getBmiColor } from "@/lib/bmi";
import { PLAN_FEES, PLAN_LABELS } from "@/types";
import { Trash2, ToggleLeft, ToggleRight, Key, Calendar, XCircle, Eye, EyeOff } from "lucide-react";
import type { MemberRow, SlotRow } from "@/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validations";

interface Props {
  members: MemberRow[];
  slots: SlotRow[];
}

export default function MembersTable({ members, slots }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [selected, setSelected]     = useState<MemberRow | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<MemberRow | null>(null);
  const [resetTarget, setResetTarget]   = useState<MemberRow | null>(null);
  const [bookTarget, setBookTarget]     = useState<MemberRow | null>(null);
  const [showPw, setShowPw]             = useState(false);
  const [showCp, setShowCp]             = useState(false);
  const [actionMsg, setActionMsg]       = useState("");

  const {
    register,
    handleSubmit,
    reset: resetForm,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  function act(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  async function onResetPassword(data: ResetPasswordInput) {
    if (!resetTarget) return;
    const result = await adminResetMemberPassword(resetTarget.id, data);
    if (result.success) {
      setActionMsg("Password reset successfully.");
      setResetTarget(null);
      resetForm();
    }
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {["Name","Member ID","Mobile","BMI","Plan","Expiry","Fee","Slot","Actions"].map((h) => (
                <th key={h} className="text-left text-slate-400 font-medium pb-3 pr-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {members.map((m) => {
              const expired = isExpired(m.expiryDate);
              return (
                <tr key={m.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3 pr-4 text-white font-medium">{m.name}</td>
                  <td className="py-3 pr-4 text-slate-400 font-mono">{m.memberId}</td>
                  <td className="py-3 pr-4 text-slate-400">{m.mobile}</td>
                  <td className="py-3 pr-4">
                    <span className={getBmiColor(m.bmi)}>{m.bmi.toFixed(1)}</span>
                    <span className="text-slate-500 text-xs ml-1">({getBmiCategory(m.bmi)})</span>
                  </td>
                  <td className="py-3 pr-4 text-slate-300">{PLAN_LABELS[m.plan]}</td>
                  <td className="py-3 pr-4">
                    <span className={expired ? "text-red-400" : "text-slate-300"}>
                      {formatDate(m.expiryDate)}
                    </span>
                    {expired && <Badge variant="danger" className="ml-1">Expired</Badge>}
                  </td>
                  <td className="py-3 pr-4">
                    <Badge variant={m.feePaid ? "success" : "warning"}>
                      {m.feePaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </td>
                  <td className="py-3 pr-4 text-slate-400 text-xs">
                    {m.booking
                      ? `${m.booking.slot.startTime}–${m.booking.slot.endTime}`
                      : <span className="text-slate-600">—</span>}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <button type="button" title="View" aria-label="View member details" onClick={() => setSelected(m)} className="p-1.5 text-slate-400 hover:text-white transition-colors">
                        <Eye size={15} />
                      </button>
                      <button type="button" title="Toggle Fee" aria-label="Toggle fee status" onClick={() => act(() => toggleFeeStatus(m.id))} disabled={isPending} className="p-1.5 text-slate-400 hover:text-emerald-400 transition-colors">
                        {m.feePaid ? <ToggleRight size={15} className="text-emerald-400" /> : <ToggleLeft size={15} />}
                      </button>
                      <button type="button" title="Reset Password" aria-label="Reset member password" onClick={() => { setResetTarget(m); resetForm(); }} className="p-1.5 text-slate-400 hover:text-yellow-400 transition-colors">
                        <Key size={15} />
                      </button>
                      {m.booking
                        ? <button type="button" title="Cancel Booking" aria-label="Cancel slot booking" onClick={() => act(() => cancelBooking(m.id))} disabled={isPending} className="p-1.5 text-slate-400 hover:text-orange-400 transition-colors"><XCircle size={15} /></button>
                        : <button type="button" title="Book Slot" aria-label="Book a slot" onClick={() => setBookTarget(m)} className="p-1.5 text-slate-400 hover:text-blue-400 transition-colors"><Calendar size={15} /></button>
                      }
                      <button type="button" title="Delete" aria-label="Delete member" onClick={() => setDeleteTarget(m)} className="p-1.5 text-slate-400 hover:text-red-400 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {members.length === 0 && (
          <p className="text-slate-500 text-center py-12">No members found.</p>
        )}
      </div>

      {actionMsg && (
        <div className="fixed bottom-6 right-6 bg-emerald-500 text-white px-4 py-2.5 rounded-lg shadow-lg text-sm">
          {actionMsg}
          <button type="button" aria-label="Dismiss" onClick={() => setActionMsg("")} className="ml-3 opacity-70 hover:opacity-100">×</button>
        </div>
      )}

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Member Details" className="max-w-2xl">
        {selected && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Name", selected.name],
                ["Member ID", selected.memberId],
                ["Mobile", selected.mobile],
                ["BMI", `${selected.bmi.toFixed(1)} — ${getBmiCategory(selected.bmi)}`],
                ["Plan", `${PLAN_LABELS[selected.plan]} (${formatCurrency(PLAN_FEES[selected.plan])})`],
                ["Joined", formatDate(selected.joinDate)],
                ["Expires", formatDate(selected.expiryDate)],
                ["Fee Status", selected.feePaid ? "Paid" : "Unpaid"],
                ["Slot", selected.booking ? `${selected.booking.slot.startTime}–${selected.booking.slot.endTime}` : "Not booked"],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-slate-500 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium">{v as string}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      <Modal open={!!deleteTarget} onClose={() => setDeleteTarget(null)} title="Delete Member">
        <p className="text-slate-300 mb-6">
          Are you sure you want to delete <strong className="text-white">{deleteTarget?.name}</strong>?
          This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button variant="danger" loading={isPending} onClick={() => {
            if (!deleteTarget) return;
            act(async () => { await deleteMember(deleteTarget.id); setDeleteTarget(null); });
          }}>
            Delete Member
          </Button>
        </div>
      </Modal>

      <Modal open={!!resetTarget} onClose={() => { setResetTarget(null); resetForm(); }} title="Reset Member Password">
        <form onSubmit={handleSubmit(onResetPassword)} className="space-y-4">
          <p className="text-slate-400 text-sm mb-2">
            Set a new password for <strong className="text-white">{resetTarget?.name}</strong>.
          </p>
          <div className="relative">
            <Input label="New Password" type={showPw ? "text" : "password"} placeholder="••••••••" error={errors.newPassword?.message} {...register("newPassword")} />
            <button type="button" aria-label={showPw ? "Hide password" : "Show password"} onClick={() => setShowPw(!showPw)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300"><Eye size={16} /></button>
          </div>
          <div className="relative">
            <Input label="Confirm Password" type={showCp ? "text" : "password"} placeholder="••••••••" error={errors.confirmPassword?.message} {...register("confirmPassword")} />
            <button type="button" aria-label={showCp ? "Hide confirm password" : "Show confirm password"} onClick={() => setShowCp(!showCp)} className="absolute right-3 top-9 text-slate-500 hover:text-slate-300"><EyeOff size={16} /></button>
          </div>
          <div className="flex gap-3 justify-end mt-4">
            <Button type="button" variant="secondary" onClick={() => { setResetTarget(null); resetForm(); }}>Cancel</Button>
            <Button type="submit" loading={isSubmitting}>Reset Password</Button>
          </div>
        </form>
      </Modal>

      <Modal open={!!bookTarget} onClose={() => setBookTarget(null)} title="Book a Slot">
        <p className="text-slate-400 text-sm mb-4">Select a time slot for <strong className="text-white">{bookTarget?.name}</strong>.</p>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((slot) => {
            const avail = slot.capacity - slot.bookings.length;
            const full  = avail === 0;
            return (
              <button
                type="button"
                key={slot.id}
                disabled={full || isPending}
                onClick={() => {
                  if (!bookTarget) return;
                  act(async () => {
                    await bookSlot(slot.id, bookTarget.id);
                    setBookTarget(null);
                  });
                }}
                className={`p-3 rounded-lg border text-sm font-medium transition-all text-left ${
                  full
                    ? "border-slate-700 text-slate-600 cursor-not-allowed"
                    : "border-slate-600 hover:border-emerald-500 text-slate-300 hover:text-emerald-400"
                }`}
              >
                <span className="font-mono">{slot.startTime}–{slot.endTime}</span>
                <span className={`block text-xs mt-0.5 ${full ? "text-red-500" : "text-slate-500"}`}>
                  {full ? "Full" : `${avail} spots left`}
                </span>
              </button>
            );
          })}
        </div>
      </Modal>
    </>
  );
}
