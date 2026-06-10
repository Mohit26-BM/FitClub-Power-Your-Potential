import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-slate-950">
      {/* Background image — replace /images/hero.jpg with your generated image */}
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Modern gym interior"
          fill
          className="object-cover object-center opacity-25"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/60" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(16,185,129,0.12),transparent_55%)]" />
      </div>

      <div className="absolute top-1/4 right-16 w-px h-48 bg-gradient-to-b from-transparent via-emerald-500/30 to-transparent hidden xl:block" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 w-full">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8 hero-animate hero-d1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Now Open 6AM – 7PM · 7 Days a Week
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-6 tracking-tight hero-animate hero-d2">
            Power Your
            <span className="block bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
              Potential.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 leading-relaxed mb-10 max-w-xl hero-animate hero-d3">
            Join FitClub and transform your body with expert-guided training,
            state-of-the-art equipment, and flexible membership plans tailored
            to your goals.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 hero-animate hero-d4">
            <Link
              href="#contact"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 text-base"
            >
              Enquire Now <ArrowRight size={18} />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-emerald-500/50 text-slate-300 hover:text-emerald-400 font-semibold rounded-xl transition-all duration-200 text-base"
            >
              <Play size={16} className="fill-current" /> View Plans
            </a>
          </div>

          <div className="flex items-center gap-10 mt-12 pt-8 border-t border-slate-800/60 hero-animate hero-d5">
            {[
              { value: "500+", label: "Active Members" },
              { value: "10",   label: "Daily Slots" },
              { value: "8+",   label: "Years Running" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-3xl font-bold text-emerald-400">{stat.value}</p>
                <p className="text-xs text-slate-500 mt-0.5 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
