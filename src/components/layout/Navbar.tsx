"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Dumbbell } from "lucide-react";

const NAV_LINKS = [
  { href: "#about",       label: "About" },
  { href: "#plans",       label: "Plans" },
  { href: "#features",    label: "Features" },
  { href: "#testimonials",label: "Testimonials" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl shrink-0">
              <Dumbbell className="text-emerald-500" size={28} />
              <span>FitClub</span>
            </Link>

            <div className="hidden md:flex items-center gap-6">
              {NAV_LINKS.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="text-slate-300 hover:text-emerald-400 transition-colors text-sm font-medium"
                >
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/register"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Register
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            className="md:hidden text-slate-300 hover:text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-slate-800 py-4 space-y-3">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block text-slate-300 hover:text-emerald-400 text-sm font-medium py-1"
              >
                {l.label}
              </a>
            ))}
            <Link
              href="/login"
              className="block mt-3 text-center px-4 py-2 text-sm font-medium bg-emerald-500 text-white rounded-lg"
            >
              Sign In
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
