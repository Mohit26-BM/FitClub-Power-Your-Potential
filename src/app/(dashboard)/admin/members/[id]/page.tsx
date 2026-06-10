import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { formatDate, formatCurrency, isExpired } from "@/lib/utils";
import { getBmiCategory, getBmiAdvice, getBmiColor } from "@/lib/bmi";
import { PLAN_LABELS, PLAN_FEES, type Plan } from "@/types";
import RenewForm from "@/components/admin/RenewForm";

export default async function MemberDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const { id } = await params;
  const member = await prisma.member.findUnique({
    where: { id },
    include: { booking: { include: { slot: true } } },
  });

  if (!member) notFound();

  const advice  = getBmiAdvice(member.bmi);
  const expired = isExpired(member.expiryDate);

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/members" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
        <ChevronLeft size={16} /> Back to Members
      </Link>

      <h1 className="text-2xl font-bold text-white mb-6">{member.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">Member Info</h2>
          <dl className="space-y-3 text-sm">
            {[
              ["Member ID", member.memberId],
              ["Mobile", member.mobile],
              ["Joined", formatDate(member.joinDate)],
              ["Expires", formatDate(member.expiryDate)],
              ["Plan", `${PLAN_LABELS[member.plan as Plan]} — ${formatCurrency(PLAN_FEES[member.plan as Plan])}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <dt className="text-slate-400">{k}</dt>
                <dd className="text-white font-medium">{v}</dd>
              </div>
            ))}
          </dl>

          <div className="flex gap-2 mt-4">
            <Badge variant={member.feePaid ? "success" : "warning"}>
              {member.feePaid ? "Fee Paid" : "Fee Unpaid"}
            </Badge>
            <Badge variant={expired ? "danger" : "success"}>
              {expired ? "Expired" : "Active"}
            </Badge>
          </div>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">BMI & Slot</h2>
          <div className="mb-4">
            <p className="text-slate-400 text-xs mb-1">BMI</p>
            <p className={`text-3xl font-bold ${getBmiColor(member.bmi)}`}>
              {member.bmi.toFixed(1)}
            </p>
            <p className="text-slate-400 text-sm">{getBmiCategory(member.bmi)}</p>
          </div>
          <div className="border-t border-slate-700 pt-4">
            <p className="text-slate-400 text-xs mb-1">Booked Slot</p>
            {member.booking ? (
              <p className="text-emerald-400 font-mono">
                {member.booking.slot.startTime} – {member.booking.slot.endTime}
              </p>
            ) : (
              <p className="text-slate-500">Not booked</p>
            )}
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Fitness Recommendation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {[
              ["Goal",     advice.goal],
              ["Cardio",   advice.cardio],
              ["Strength", advice.strength],
              ["Diet",     advice.diet],
              ["Tip",      advice.tip],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="text-slate-500 text-xs mb-0.5">{k}</p>
                <p className="text-slate-200">{v}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="md:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Renew Membership</h2>
          <RenewForm
            memberId={member.id}
            currentPlan={member.plan}
            expiryDate={member.expiryDate}
          />
        </Card>
      </div>
    </div>
  );
}
