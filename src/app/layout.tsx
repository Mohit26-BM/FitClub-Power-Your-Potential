import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FitClub — Gym Management System",
  description:
    "Your premier fitness destination. Manage memberships, book slots, and track your fitness journey.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
