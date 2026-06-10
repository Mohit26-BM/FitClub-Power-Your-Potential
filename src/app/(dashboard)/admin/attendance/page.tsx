import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import AttendanceManager from "@/components/admin/AttendanceManager";

export const metadata = { title: "Attendance — FitClub Admin" };

interface PageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function AdminAttendancePage({ searchParams }: PageProps) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const { date: dateParam } = await searchParams;
  const today = new Date().toISOString().split("T")[0];
  const selectedDate = dateParam ?? today;

  const targetDate = new Date(selectedDate);
  targetDate.setUTCHours(0, 0, 0, 0);

  const [members, attendanceRecords] = await Promise.all([
    prisma.member.findMany({
      orderBy: { name: "asc" },
      select: {
        id: true,
        memberId: true,
        name: true,
        booking: {
          select: {
            slot: { select: { startTime: true, endTime: true } },
          },
        },
      },
    }),
    prisma.attendance.findMany({
      where: { date: targetDate },
      select: { memberId: true, slotId: true },
    }),
  ]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Attendance</h1>
        <p className="text-slate-400 text-sm mt-1">
          Mark daily attendance for gym members
        </p>
      </div>

      <Card>
        <AttendanceManager
          members={members}
          attendanceRecords={attendanceRecords}
          initialDate={selectedDate}
        />
      </Card>
    </div>
  );
}
