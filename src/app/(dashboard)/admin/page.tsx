import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Users, Clock, CreditCard, AlertTriangle, CalendarClock, MessageSquare } from "lucide-react";
import { isExpired, formatCurrency } from "@/lib/utils";
import { PLAN_FEES, PLAN_LABELS, type Plan } from "@/types";
import Link from "next/link";
import { addDays } from "date-fns";

export const metadata = { title: "Admin Dashboard — FitClub" };

export default async function AdminDashboard() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const now = new Date();
  const sevenDaysLater = addDays(now, 7);

  const [members, slots, newInquiriesCount] = await Promise.all([
    prisma.member.findMany({ include: { booking: true } }),
    prisma.slot.findMany({ include: { bookings: true } }),
    prisma.contactInquiry.count({ where: { status: "new" } }),
  ]);

  const totalMembers   = members.length;
  const paidMembers    = members.filter((m) => m.feePaid).length;
  const expiredMembers = members.filter((m) => isExpired(m.expiryDate)).length;
  const activeBookings = members.filter((m) => m.booking).length;
  const expiringSoon   = members.filter(
    (m) => !isExpired(m.expiryDate) && m.expiryDate <= sevenDaysLater
  ).length;

  const revenue = {
    MONTHLY:   members.filter((m) => m.plan === "MONTHLY"   && m.feePaid).length * PLAN_FEES.MONTHLY,
    QUARTERLY: members.filter((m) => m.plan === "QUARTERLY" && m.feePaid).length * PLAN_FEES.QUARTERLY,
    ANNUAL:    members.filter((m) => m.plan === "ANNUAL"    && m.feePaid).length * PLAN_FEES.ANNUAL,
  };
  const totalRevenue = revenue.MONTHLY + revenue.QUARTERLY + revenue.ANNUAL;

  const recentMembers = [...members]
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .slice(0, 5);

  const stats = [
    { label: "Total Members",       value: totalMembers,   icon: Users,        color: "text-blue-400",    bg: "bg-blue-500/10 border-blue-500/20" },
    { label: "Fee Paid",             value: paidMembers,    icon: CreditCard,   color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
    { label: "Active Slot Bookings", value: activeBookings, icon: Clock,        color: "text-purple-400",  bg: "bg-purple-500/10 border-purple-500/20" },
    { label: "Expired Memberships",  value: expiredMembers, icon: AlertTriangle,color: "text-red-400",     bg: "bg-red-500/10 border-red-500/20" },
    { label: "Expiring Soon",        value: expiringSoon,   icon: CalendarClock,color: "text-yellow-400",  bg: "bg-yellow-500/10 border-yellow-500/20" },
    { label: "New Inquiries",        value: newInquiriesCount, icon: MessageSquare, color: "text-pink-400", bg: "bg-pink-500/10 border-pink-500/20" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, Admin! Here&apos;s your overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-400 text-sm">{stat.label}</p>
                <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${stat.bg}`}>
                <stat.icon className={stat.color} size={22} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Revenue by Plan</CardTitle>
          </CardHeader>
          <div className="space-y-4">
            {(["MONTHLY", "QUARTERLY", "ANNUAL"] as Plan[]).map((plan) => {
              const count = members.filter((m) => m.plan === plan && m.feePaid).length;
              const amount = count * PLAN_FEES[plan];
              return (
                <div key={plan} className="flex items-center justify-between py-2 border-b border-slate-700 last:border-0">
                  <span className="text-slate-300 text-sm">
                    {PLAN_LABELS[plan]} ({formatCurrency(PLAN_FEES[plan])})
                  </span>
                  <div className="text-right">
                    <span className="text-emerald-400 font-semibold">{formatCurrency(amount)}</span>
                    <span className="text-slate-500 text-xs ml-2">({count} paid)</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center justify-between pt-2">
              <span className="text-white font-semibold">Total Revenue</span>
              <span className="text-emerald-400 font-bold text-lg">{formatCurrency(totalRevenue)}</span>
            </div>
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Slot Occupancy</CardTitle>
          </CardHeader>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {slots.map((slot) => {
              const pct = Math.round((slot.bookings.length / slot.capacity) * 100);
              return (
                <div key={slot.id} className="flex items-center gap-3">
                  <span className="text-slate-400 text-xs font-mono w-24">
                    {slot.startTime}–{slot.endTime}
                  </span>
                  <div
                    className={`flex-1 rounded-full h-2 bg-slate-700 overflow-hidden [--bar-w:${Math.min(pct,100)}%]`}
                  >
                    <div
                      className={`h-full w-[var(--bar-w)] rounded-full transition-all ${
                        pct >= 100 ? "bg-red-500" : pct >= 75 ? "bg-yellow-500" : "bg-emerald-500"
                      }`}
                    />
                  </div>
                  <span className="text-slate-400 text-xs w-16 text-right">
                    {slot.bookings.length}/{slot.capacity}
                  </span>
                </div>
              );
            })}
            {slots.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-4">No slots configured.</p>
            )}
          </div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Members</CardTitle>
          <Link href="/admin/members" className="text-emerald-400 hover:text-emerald-300 text-sm transition-colors">
            View all →
          </Link>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium pb-3">Name</th>
                <th className="text-left text-slate-400 font-medium pb-3">Member ID</th>
                <th className="text-left text-slate-400 font-medium pb-3">Plan</th>
                <th className="text-left text-slate-400 font-medium pb-3">Fee</th>
                <th className="text-left text-slate-400 font-medium pb-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recentMembers.map((m) => (
                <tr key={m.id}>
                  <td className="py-3 text-white">{m.name}</td>
                  <td className="py-3 text-slate-400 font-mono">{m.memberId}</td>
                  <td className="py-3 text-slate-300 capitalize">{m.plan.toLowerCase()}</td>
                  <td className="py-3">
                    <Badge variant={m.feePaid ? "success" : "warning"}>
                      {m.feePaid ? "Paid" : "Unpaid"}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Badge variant={isExpired(m.expiryDate) ? "danger" : "success"}>
                      {isExpired(m.expiryDate) ? "Expired" : "Active"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {recentMembers.length === 0 && (
            <p className="text-slate-500 text-center py-8">No members yet.</p>
          )}
        </div>
      </Card>
    </div>
  );
}
