import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import AddMemberForm from "@/components/admin/AddMemberForm";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export const metadata = { title: "Add Member — FitClub Admin" };

export default async function AddMemberPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/members" className="inline-flex items-center gap-1 text-slate-400 hover:text-white text-sm transition-colors mb-4">
          <ChevronLeft size={16} /> Back to Members
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Member</h1>
        <p className="text-slate-400 text-sm mt-1">Fill in the details to register a new gym member.</p>
      </div>

      <Card className="max-w-3xl">
        <AddMemberForm />
      </Card>
    </div>
  );
}
