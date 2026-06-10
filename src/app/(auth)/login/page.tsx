import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "@/components/auth/LoginForm";
import { SessionProvider } from "next-auth/react";

export const metadata = { title: "Sign In — FitClub" };

export default async function LoginPage() {
  const session = await auth();
  if (session?.user?.role === "admin")  redirect("/admin");
  if (session?.user?.role === "member") redirect("/member");

  return (
    <SessionProvider>
      <LoginForm />
    </SessionProvider>
  );
}
