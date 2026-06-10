import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import BmiCard from "@/components/member/BmiCard";
import { formatDate, formatCurrency, isExpired } from "@/lib/utils";
import { PLAN_LABELS, PLAN_FEES, type Plan } from "@/types";
import { AlertTriangle, Clock } from "lucide-react";

export const metadata = { title: "My Profile — FitClub" };

export default async function MemberProfilePage() {
  const session = await auth();
  if (session?.user?.role !== "member") redirect("/login");

  const member = await prisma.member.findUnique({
    where: { id: session.user.id },
    include: { booking: { include: { slot: true } } },
  });
  if (!member) redirect("/login");

  const expired = isExpired(member.expiryDate);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Welcome, {member.name}!</h1>
        <p className="text-slate-400 text-sm mt-1">Your membership overview.</p>
      </div>

      {(!member.feePaid || expired) && (
        <div className="mb-6 space-y-3">
          {!member.feePaid && (
            <div className="flex items-center gap-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 text-yellow-400">
              <AlertTriangle size={18} />
              <p className="text-sm font-medium">Your membership fee is unpaid. Please contact the admin.</p>
            </div>
          )}
          {expired && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400">
              <AlertTriangle size={18} />
              <p className="text-sm font-medium">
                Your membership expired on {formatDate(member.expiryDate)}. Please renew with admin.
              </p>
            </div>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <h2 className="text-lg font-semibold text-white mb-4">Member Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {[
              ["Member ID", member.memberId],
              ["Mobile",    member.mobile],
              ["Plan",      `${PLAN_LABELS[member.plan as Plan]} — ${formatCurrency(PLAN_FEES[member.plan as Plan])}`],
              ["Joined",    formatDate(member.joinDate)],
              ["Expires",   formatDate(member.expiryDate)],
            ].map(([k, v]) => (
              <div key={k}>
                <dt className="text-slate-500 text-xs mb-0.5">{k}</dt>
                <dd className="text-white font-medium">{v}</dd>
              </div>
            ))}
            <div>
              <dt className="text-slate-500 text-xs mb-0.5">Fee Status</dt>
              <dd>
                <Badge variant={member.feePaid ? "success" : "warning"}>
                  {member.feePaid ? "Paid" : "Unpaid"}
                </Badge>
              </dd>
            </div>
            <div>
              <dt className="text-slate-500 text-xs mb-0.5">Membership</dt>
              <dd>
                <Badge variant={expired ? "danger" : "success"}>
                  {expired ? "Expired" : "Active"}
                </Badge>
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-white mb-4">My Slot</h2>
          {member.booking ? (
            <div className="text-center py-4">
              <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Clock className="text-emerald-400" size={24} />
              </div>
              <p className="text-emerald-400 font-mono text-lg font-bold">
                {member.booking.slot.startTime}
              </p>
              <p className="text-slate-400 text-sm">to</p>
              <p className="text-emerald-400 font-mono text-lg font-bold">
                {member.booking.slot.endTime}
              </p>
              <Badge variant="success" className="mt-3">Active Booking</Badge>
            </div>
          ) : (
            <div className="text-center py-8">
              <Clock className="text-slate-600 mx-auto mb-3" size={32} />
              <p className="text-slate-500 text-sm">No slot booked yet.</p>
              <a href="/member/slots" className="text-emerald-400 hover:text-emerald-300 text-sm mt-2 inline-block transition-colors">
                Book a slot →
              </a>
            </div>
          )}
        </Card>
      </div>

      <BmiCard bmi={member.bmi} />
    </div>
  );
}
