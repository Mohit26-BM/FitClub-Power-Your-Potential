import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTA() {
  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-gradient-to-br from-emerald-500/10 to-slate-900 border border-emerald-500/20 rounded-2xl p-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start Your
            <span className="text-emerald-400"> Fitness Journey?</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
            Join FitClub today. Your first step toward a healthier, stronger you
            starts right here.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold rounded-xl transition-all shadow-lg shadow-emerald-500/25"
            >
              Get Started Today <ArrowRight size={18} />
            </Link>
            <a
              href="#plans"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white font-semibold rounded-xl transition-all"
            >
              View Plans
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
