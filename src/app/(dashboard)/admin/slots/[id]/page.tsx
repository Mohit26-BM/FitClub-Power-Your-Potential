import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SlotDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const { id } = await params;
  const slot = await prisma.slot.findUnique({
    where: { id },
    include: {
      bookings: {
        include: {
          member: {
            select: { id: true, memberId: true, name: true, plan: true, feePaid: true },
          },
        },
      },
    },
  });

  if (!slot) notFound();

  const count  = slot.bookings.length;
  const status = count >= slot.capacity ? "full" : count >= slot.capacity * 0.75 ? "almost" : "open";

  return (
    <div className="p-8 max-w-3xl">
      <Link href="/admin/slots" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm mb-4 transition-colors">
        <ChevronLeft size={16} /> Back to Slots
      </Link>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white font-mono">
            {slot.startTime} – {slot.endTime}
          </h1>
          <p className="text-slate-400 text-sm mt-1">{count} of {slot.capacity} spots booked</p>
        </div>
        <Badge variant={status === "full" ? "danger" : status === "almost" ? "warning" : "success"} className="text-sm px-3 py-1">
          {status === "full" ? "Full" : status === "almost" ? "Almost Full" : "Open"}
        </Badge>
      </div>

      <Card className="mb-4">
        <div className="mb-4">
          <div className="flex justify-between text-xs text-slate-400 mb-2">
            <span>Occupancy</span>
            <span>{count}/{slot.capacity}</span>
          </div>
          <div className="bg-slate-700 rounded-full h-3">
            <div
              className={`h-3 rounded-full ${status === "full" ? "bg-red-500" : status === "almost" ? "bg-yellow-500" : "bg-emerald-500"}`}
              style={{ width: `${(count / slot.capacity) * 100}%` }}
            />
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">
          Booked Members ({count})
        </h2>
        {count === 0 ? (
          <p className="text-slate-500 text-center py-8">No members booked in this slot.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4">#</th>
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4">Name</th>
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4">Member ID</th>
                  <th className="text-left text-slate-400 font-medium pb-3 pr-4">Plan</th>
                  <th className="text-left text-slate-400 font-medium pb-3">Fee</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {slot.bookings.map((b, i) => (
                  <tr key={b.id}>
                    <td className="py-3 pr-4 text-slate-500">{i + 1}</td>
                    <td className="py-3 pr-4">
                      <Link href={`/admin/members/${b.member.id}`} className="text-white hover:text-emerald-400 transition-colors">
                        {b.member.name}
                      </Link>
                    </td>
                    <td className="py-3 pr-4 text-slate-400 font-mono">{b.member.memberId}</td>
                    <td className="py-3 pr-4 text-slate-300 capitalize">{b.member.plan.toLowerCase()}</td>
                    <td className="py-3">
                      <Badge variant={b.member.feePaid ? "success" : "warning"}>
                        {b.member.feePaid ? "Paid" : "Unpaid"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
