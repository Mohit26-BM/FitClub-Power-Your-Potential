"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function bookSlot(slotId: string, memberId?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const targetId =
    session.user.role === "admin" && memberId
      ? (await prisma.member.findUnique({ where: { id: memberId } }))?.id
      : session.user.id;

  if (!targetId) return { error: "Member not found" };

  const member = await prisma.member.findUnique({
    where: { id: targetId },
    include: { booking: true },
  });
  if (!member) return { error: "Member not found" };
  if (member.booking) return { error: "Member already has an active slot booking. Cancel it first." };

  const slot = await prisma.slot.findUnique({
    where: { id: slotId },
    include: { bookings: true },
  });
  if (!slot) return { error: "Slot not found" };
  if (slot.bookings.length >= slot.capacity) return { error: "Slot is full" };

  await prisma.slotBooking.create({
    data: { slotId, memberId: targetId },
  });

  revalidatePath("/admin/slots");
  revalidatePath("/member/slots");
  return { success: true };
}

export async function cancelBooking(memberId?: string) {
  const session = await auth();
  if (!session?.user) return { error: "Unauthorized" };

  const targetId =
    session.user.role === "admin" && memberId ? memberId : session.user.id;

  const booking = await prisma.slotBooking.findUnique({
    where: { memberId: targetId },
  });
  if (!booking) return { error: "No active booking found" };

  await prisma.slotBooking.delete({ where: { memberId: targetId } });

  revalidatePath("/admin/slots");
  revalidatePath("/member/slots");
  return { success: true };
}
