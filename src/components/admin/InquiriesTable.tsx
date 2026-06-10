"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { updateInquiryStatus } from "@/actions/contact.actions";
import { PLAN_LABELS } from "@/types";
import { Eye } from "lucide-react";
import type { Plan } from "@/types";

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  message: string;
  status: string;
  createdAt: Date;
}

const STATUS_VARIANTS = {
  new:       "info",
  contacted: "warning",
  enrolled:  "success",
} as const;

const STATUS_LABELS = {
  new:       "New",
  contacted: "Contacted",
  enrolled:  "Enrolled",
};

export default function InquiriesTable({ inquiries }: { inquiries: Inquiry[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selected, setSelected] = useState<Inquiry | null>(null);

  function changeStatus(id: string, status: string) {
    startTransition(async () => {
      await updateInquiryStatus(id, status);
      router.refresh();
      if (selected?.id === id) setSelected((p) => p ? { ...p, status } : null);
    });
  }

  if (inquiries.length === 0) {
    return (
      <div className="text-center py-16 text-slate-500">
        No inquiries yet. They will appear here once visitors submit the contact form.
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-700">
              {["Name","Email","Phone","Plan","Status","Date",""].map((h) => (
                <th key={h} className="text-left text-slate-400 font-medium px-6 py-4 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {inquiries.map((inq) => (
              <tr key={inq.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 text-white font-medium">{inq.name}</td>
                <td className="px-6 py-4 text-slate-400">{inq.email}</td>
                <td className="px-6 py-4 text-slate-400">{inq.phone}</td>
                <td className="px-6 py-4 text-slate-300">
                  {PLAN_LABELS[inq.plan as Plan] ?? inq.plan}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={STATUS_VARIANTS[inq.status as keyof typeof STATUS_VARIANTS] ?? "default"}>
                    {STATUS_LABELS[inq.status as keyof typeof STATUS_LABELS] ?? inq.status}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-slate-500 text-xs">
                  {new Date(inq.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => setSelected(inq)} className="text-slate-400 hover:text-white transition-colors">
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Inquiry Details" className="max-w-lg">
        {selected && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                ["Name",  selected.name],
                ["Email", selected.email],
                ["Phone", selected.phone],
                ["Plan",  PLAN_LABELS[selected.plan as Plan] ?? selected.plan],
              ].map(([k, v]) => (
                <div key={k}>
                  <p className="text-slate-500 text-xs mb-0.5">{k}</p>
                  <p className="text-white font-medium">{v}</p>
                </div>
              ))}
            </div>

            <div>
              <p className="text-slate-500 text-xs mb-1">Message</p>
              <p className="text-slate-200 text-sm bg-slate-900 rounded-lg p-3 border border-slate-700 leading-relaxed">
                {selected.message}
              </p>
            </div>

            <div>
              <p className="text-slate-400 text-sm font-medium mb-3">Update Status</p>
              <div className="flex gap-2">
                {(["new", "contacted", "enrolled"] as const).map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={selected.status === s ? "primary" : "secondary"}
                    loading={isPending}
                    onClick={() => changeStatus(selected.id, s)}
                    className="capitalize"
                  >
                    {STATUS_LABELS[s]}
                  </Button>
                ))}
              </div>
            </div>

            {selected.status !== "enrolled" && (
              <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 text-xs text-slate-400">
                <p className="font-medium text-slate-300 mb-1">Next step</p>
                {selected.status === "new"
                  ? "Call the lead, discuss their goals, and mark as Contacted."
                  : "Create their Member ID via Add Member, then mark as Enrolled."}
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
}
