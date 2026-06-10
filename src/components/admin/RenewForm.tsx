"use client";

import { useState, useTransition } from "react";
import { RefreshCcw } from "lucide-react";
import { renewMembership } from "@/actions/member.actions";
import Button from "@/components/ui/Button";
import { PLAN_LABELS, PLAN_FEES, type Plan } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";

interface Props {
  memberId: string;
  currentPlan: string;
  expiryDate: Date;
}

export default function RenewForm({ memberId, currentPlan, expiryDate }: Props) {
  const [plan, setPlan] = useState(currentPlan);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleRenew() {
    setMessage(null);
    startTransition(async () => {
      const result = await renewMembership(memberId, plan);
      if (result?.error) {
        setMessage({ type: "error", text: typeof result.error === "string" ? result.error : "Failed to renew." });
      } else {
        setMessage({ type: "success", text: "Membership renewed successfully! Page will refresh." });
        setTimeout(() => window.location.reload(), 1500);
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Current Plan</p>
          <p className="text-white font-medium">{PLAN_LABELS[currentPlan as Plan]}</p>
        </div>
        <div>
          <p className="text-slate-500 text-xs mb-0.5">Expires</p>
          <p className="text-white font-medium">{formatDate(expiryDate)}</p>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1.5">
          New Plan
        </label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="w-full rounded-lg bg-slate-700 border border-slate-600 hover:border-slate-500 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
        >
          {(["MONTHLY", "QUARTERLY", "ANNUAL"] as Plan[]).map((p) => (
            <option key={p} value={p}>
              {PLAN_LABELS[p]} — {formatCurrency(PLAN_FEES[p])}
            </option>
          ))}
        </select>
        <p className="mt-1 text-xs text-slate-500">
          Renewal extends from current expiry (or today if already expired).
          Fee marked as paid automatically.
        </p>
      </div>

      {message && (
        <div
          className={`rounded-lg p-3 text-sm ${
            message.type === "success"
              ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
              : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}
        >
          {message.text}
        </div>
      )}

      <Button
        onClick={handleRenew}
        loading={isPending}
        className="w-full"
      >
        <RefreshCcw size={16} className="mr-2" />
        Renew Membership
      </Button>
    </div>
  );
}
