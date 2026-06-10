import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { formatDate } from "@/lib/utils";
import { Calendar, Clock } from "lucide-react";
import { format, startOfMonth } from "date-fns";

export const metadata = { title: "My Attendance — FitClub" };

export default async function MemberAttendancePage() {
  const session = await auth();
  if (session?.user?.role !== "member") redirect("/login");

  const memberId = session.user.id;
  const now = new Date();
  const monthStart = startOfMonth(now);

  const records = await prisma.attendance.findMany({
    where: { memberId },
    orderBy: { date: "desc" },
    take: 60,
    include: { slot: { select: { startTime: true, endTime: true } } },
  });

  const totalAllTime = records.length;
  const thisMonthCount = records.filter((r) => r.date >= monthStart).length;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">My Attendance</h1>
        <p className="text-slate-400 text-sm mt-1">Track your gym attendance history</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">This Month</p>
              <p className="text-3xl font-bold text-white mt-1">{thisMonthCount}</p>
              <p className="text-slate-500 text-xs mt-0.5">{format(now, "MMMM yyyy")}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Calendar className="text-emerald-400" size={22} />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-sm">Total Days</p>
              <p className="text-3xl font-bold text-white mt-1">{totalAllTime}</p>
              <p className="text-slate-500 text-xs mt-0.5">All time</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Clock className="text-blue-400" size={22} />
            </div>
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-white mb-4">Attendance History</h2>

        {records.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="text-slate-600 mx-auto mb-3" size={40} />
            <p className="text-slate-400 font-medium">No attendance records yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Your attendance will appear here once it is marked by the gym staff.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left text-slate-400 font-medium pb-3">Date</th>
                  <th className="text-left text-slate-400 font-medium pb-3">Day</th>
                  <th className="text-left text-slate-400 font-medium pb-3">Time Slot</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.map((record) => (
                  <tr key={record.id}>
                    <td className="py-3 text-white font-medium">{formatDate(record.date)}</td>
                    <td className="py-3 text-slate-400">{format(record.date, "EEEE")}</td>
                    <td className="py-3">
                      {record.slot ? (
                        <span className="text-emerald-400 font-mono text-xs">
                          {record.slot.startTime} – {record.slot.endTime}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-xs">No slot</span>
                      )}
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
