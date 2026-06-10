import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/Card";
import AdminSettingsForm from "@/components/admin/AdminSettingsForm";

export const metadata = { title: "Settings — FitClub Admin" };

export default async function AdminSettingsPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 text-sm mt-1">Manage admin account settings.</p>
      </div>

      <Card className="max-w-lg">
        <AdminSettingsForm />
      </Card>
    </div>
  );
}
