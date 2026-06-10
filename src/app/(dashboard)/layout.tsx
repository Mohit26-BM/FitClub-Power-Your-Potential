import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/layout/Sidebar";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-slate-950">
        <Sidebar role={session.user.role} name={session.user.name ?? "User"} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SessionProvider>
  );
}
