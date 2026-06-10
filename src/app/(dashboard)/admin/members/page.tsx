import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import MembersTable from "@/components/admin/MembersTable";
import Link from "next/link";
import { UserPlus } from "lucide-react";

export const metadata = { title: "Members — FitClub Admin" };

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export default async function AdminMembersPage({ searchParams }: Props) {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const { q } = await searchParams;

  const [members, slots] = await Promise.all([
    prisma.member.findMany({
      where: q
        ? {
            OR: [
              { name: { contains: q } },
              { memberId: { contains: q } },
            ],
          }
        : undefined,
      include: {
        booking: { include: { slot: { select: { startTime: true, endTime: true } } } },
      },
      orderBy: { name: "asc" },
    }),
    prisma.slot.findMany({
      include: {
        bookings: { include: { member: { select: { id: true, memberId: true, name: true } } } },
      },
      orderBy: { startTime: "asc" },
    }),
  ]);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Members</h1>
          <p className="text-slate-400 text-sm mt-1">{members.length} member{members.length !== 1 ? "s" : ""} found</p>
        </div>
        <Link
          href="/admin/members/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          <UserPlus size={16} /> Add Member
        </Link>
      </div>

      <Card className="mb-4" noPadding>
        <form className="p-4 border-b border-slate-700">
          <input
            name="q"
            defaultValue={q}
            placeholder="Search by name or member ID…"
            className="w-full bg-transparent text-white placeholder-slate-500 text-sm focus:outline-none"
          />
        </form>
        <div className="p-4 pt-2">
          <MembersTable members={members as never} slots={slots as never} />
        </div>
      </Card>
    </div>
  );
}
