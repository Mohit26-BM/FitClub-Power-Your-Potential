import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";

export const metadata = { title: "Slots — FitClub Admin" };

export default async function AdminSlotsPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const slots = await prisma.slot.findMany({
    include: { bookings: { include: { member: { select: { name: true, memberId: true } } } } },
    orderBy: { startTime: "asc" },
  });

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Time Slots</h1>
        <p className="text-slate-400 text-sm mt-1">Overview of all training slots and their occupancy.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {slots.map((slot) => {
          const count  = slot.bookings.length;
          const pct    = Math.round((count / slot.capacity) * 100);
          const status = count >= slot.capacity ? "full" : count >= slot.capacity * 0.75 ? "almost" : "open";
          return (
            <Link key={slot.id} href={`/admin/slots/${slot.id}`}>
              <Card className="hover:border-emerald-500/50 transition-all cursor-pointer h-full">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-white font-mono font-semibold">{slot.startTime} – {slot.endTime}</p>
                  <Badge variant={status === "full" ? "danger" : status === "almost" ? "warning" : "success"}>
                    {status === "full" ? "Full" : status === "almost" ? "Almost Full" : "Open"}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-slate-400 mb-1">
                    <span>Occupancy</span>
                    <span>{count}/{slot.capacity}</span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        status === "full" ? "bg-red-500" : status === "almost" ? "bg-yellow-500" : "bg-emerald-500"
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                <p className="text-xs text-slate-500">{slot.capacity - count} spot{slot.capacity - count !== 1 ? "s" : ""} available</p>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
