import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import InquiriesTable from "@/components/admin/InquiriesTable";

export const metadata = { title: "Inquiries — FitClub Admin" };

export default async function AdminInquiriesPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/login");

  const inquiries = await prisma.contactInquiry.findMany({
    orderBy: { createdAt: "desc" },
  });

  const counts = {
    new:       inquiries.filter((i) => i.status === "new").length,
    contacted: inquiries.filter((i) => i.status === "contacted").length,
    enrolled:  inquiries.filter((i) => i.status === "enrolled").length,
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Membership Inquiries</h1>
        <p className="text-slate-400 text-sm mt-1">
          Leads submitted via the website contact form.
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: "New",       count: counts.new,       variant: "info"    as const },
          { label: "Contacted", count: counts.contacted, variant: "warning" as const },
          { label: "Enrolled",  count: counts.enrolled,  variant: "success" as const },
        ].map((s) => (
          <Card key={s.label} className="flex items-center justify-between">
            <p className="text-slate-400 text-sm">{s.label}</p>
            <Badge variant={s.variant} className="text-base px-3 py-1">{s.count}</Badge>
          </Card>
        ))}
      </div>

      <Card noPadding>
        <InquiriesTable inquiries={inquiries} />
      </Card>
    </div>
  );
}
