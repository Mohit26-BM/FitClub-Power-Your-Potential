import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import MemberSettingsForm from "@/components/member/MemberSettingsForm";

export const metadata = { title: "Settings — FitClub Member" };

export default async function MemberSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "member") redirect("/login");

  const member = await prisma.member.findUnique({ where: { id: session.user.id } });
  if (!member) redirect("/login");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Update your profile and password.</p>
      </div>

      <Card className="max-w-lg">
        <MemberSettingsForm mobile={member.mobile} bmi={member.bmi} />
      </Card>
    </div>
  );
}
