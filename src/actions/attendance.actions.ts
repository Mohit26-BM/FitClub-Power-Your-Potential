"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

function toMidnightUTC(date: Date): Date {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export async function markAttendance(memberId: string, date: Date, slotId?: string) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const normalizedDate = toMidnightUTC(date);
  await prisma.attendance.upsert({
    where: { memberId_date: { memberId, date: normalizedDate } },
    create: { memberId, date: normalizedDate, slotId: slotId ?? null },
    update: { slotId: slotId ?? null },
  });

  revalidatePath("/admin/attendance");
  return { success: true };
}

export async function removeAttendance(memberId: string, date: Date) {
  const session = await auth();
  if (session?.user?.role !== "admin") return { error: "Unauthorized" };

  const normalizedDate = toMidnightUTC(date);
  await prisma.attendance.deleteMany({
    where: { memberId, date: normalizedDate },
  });

  revalidatePath("/admin/attendance");
  return { success: true };
}

export async function getMemberAttendance(memberId: string) {
  const records = await prisma.attendance.findMany({
    where: { memberId },
    orderBy: { date: "desc" },
    include: { slot: { select: { startTime: true, endTime: true } } },
  });
  return records;
}

export async function getAttendanceForDate(dateStr: string) {
  const date = new Date(dateStr);
  const normalizedDate = toMidnightUTC(date);

  const records = await prisma.attendance.findMany({
    where: { date: normalizedDate },
    select: { memberId: true, slotId: true },
  });

  return records;
}
