import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import SlotBookingCard from "@/components/member/SlotBookingCard";

export const metadata = { title: "Slots — FitClub Member" };

export default async function MemberSlotsPage() {
  const session = await auth();
  if (session?.user?.role !== "member") redirect("/login");

  const [member, slots] = await Promise.all([
    prisma.member.findUnique({
      where: { id: session.user.id },
      include: { booking: true },
    }),
    prisma.slot.findMany({
      include: {
        bookings: {
          include: { member: { select: { id: true, memberId: true, name: true } } },
        },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  if (!member) redirect("/login");

  const currentBookingSlotId = member.booking?.slotId ?? null;

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Training Slots</h1>
        <p className="text-slate-400 text-sm mt-1">
          {currentBookingSlotId
            ? "You have an active booking. Cancel it to switch slots."
            : "Select a time slot to book your training session."}
        </p>
      </div>

      <SlotBookingCard slots={slots as never} currentBookingSlotId={currentBookingSlotId} />
    </div>
  );
}
