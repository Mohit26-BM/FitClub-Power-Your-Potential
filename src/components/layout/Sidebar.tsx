"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Dumbbell, LayoutDashboard, Users, Clock, Settings,
  LogOut, User, Calendar, MessageSquare, ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Role } from "@/types";

const ADMIN_LINKS = [
  { href: "/admin",               label: "Dashboard",  icon: LayoutDashboard },
  { href: "/admin/members",       label: "Members",    icon: Users },
  { href: "/admin/slots",         label: "Slots",      icon: Clock },
  { href: "/admin/attendance",    label: "Attendance", icon: ClipboardList },
  { href: "/admin/inquiries",     label: "Inquiries",  icon: MessageSquare },
  { href: "/admin/settings",      label: "Settings",   icon: Settings },
];

const MEMBER_LINKS = [
  { href: "/member",              label: "My Profile", icon: User },
  { href: "/member/slots",        label: "Slots",      icon: Calendar },
  { href: "/member/attendance",   label: "Attendance", icon: ClipboardList },
  { href: "/member/settings",     label: "Settings",   icon: Settings },
];

interface SidebarProps {
  role: Role;
  name: string;
}

export default function Sidebar({ role, name }: SidebarProps) {
  const pathname = usePathname();
  const links = role === "admin" ? ADMIN_LINKS : MEMBER_LINKS;

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 min-h-screen flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <Link href="/" className="flex items-center gap-2 text-white font-bold text-lg">
          <Dumbbell className="text-emerald-500" size={24} />
          <span>FitClub</span>
        </Link>
      </div>

      <div className="px-4 py-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <span className="text-emerald-400 font-semibold text-sm">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-white text-sm font-medium truncate max-w-[140px]">{name}</p>
            <p className="text-slate-400 text-xs capitalize">{role}</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/admin" || href === "/member"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all",
                active
                  ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              )}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
