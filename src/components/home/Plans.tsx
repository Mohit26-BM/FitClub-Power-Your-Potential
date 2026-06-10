import { Check, Zap } from "lucide-react";
import Link from "next/link";
import AnimateIn from "@/components/ui/AnimateIn";

const PLANS = [
  {
    name: "Monthly",
    price: "₹2,499",
    period: "/month",
    saving: null,
    features: [
      "Full gym access (6AM – 7PM)",
      "10 daily training slots",
      "BMI & fitness assessment",
      "Online member portal",
      "Locker room access",
    ],
    highlighted: false,
    cta: "Start Monthly",
  },
  {
    name: "Quarterly",
    price: "₹6,499",
    period: "/3 months",
    saving: "Save ₹998",
    perMonth: "₹2,166/mo",
    features: [
      "Everything in Monthly",
      "Priority slot booking",
      "Personalised workout plan",
      "Body composition analysis",
      "Guest pass (1/month)",
    ],
    highlighted: true,
    badge: "Most Popular",
    cta: "Start Quarterly",
  },
  {
    name: "Annual",
    price: "₹21,999",
    period: "/year",
    saving: "Save ₹7,989",
    perMonth: "₹1,833/mo",
    features: [
      "Everything in Quarterly",
      "Unlimited guest passes",
      "Free nutrition consultation",
      "Dedicated trainer (2 sessions)",
      "Free annual health check-up",
    ],
    highlighted: false,
    cta: "Start Annual",
  },
];

export default function Plans() {
  return (
    <section id="plans" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn from="up" className="text-center mb-16">
          <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Membership Plans
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            No joining fee. No hidden charges. Cancel or upgrade anytime.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <AnimateIn key={plan.name} from="up" delay={i * 120} className="flex flex-col">
              <div
                className={`relative rounded-2xl border flex flex-col flex-1 transition-all duration-200 ${
                  plan.highlighted
                    ? "bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500 shadow-2xl shadow-emerald-500/10 scale-105"
                    : "bg-slate-900 border-slate-800 hover:border-slate-700"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-4 left-0 right-0 flex justify-center">
                    <span className="inline-flex items-center gap-1.5 bg-emerald-500 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                      <Zap size={11} className="fill-white" /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="p-8 flex-1 flex flex-col">
                  <div className="mb-6">
                    <h3 className="text-white font-bold text-xl mb-1">{plan.name}</h3>
                    {plan.saving && (
                      <span className="inline-block bg-orange-500/15 text-orange-400 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-orange-500/20">
                        {plan.saving}
                      </span>
                    )}
                  </div>

                  <div className="mb-6">
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">{plan.price}</span>
                      <span className="text-slate-400 pb-1 text-sm">{plan.period}</span>
                    </div>
                    {plan.perMonth && (
                      <p className="text-slate-500 text-xs mt-1">≈ {plan.perMonth} billed quarterly</p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-slate-300 text-sm">
                        <Check size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <Link
                    href="/login"
                    className={`block text-center py-3 rounded-xl font-semibold text-sm transition-all ${
                      plan.highlighted
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25"
                        : "border border-slate-700 hover:border-emerald-500 text-slate-300 hover:text-emerald-400"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>

        <p className="text-center text-slate-500 text-sm mt-8">
          All plans include a 7-day free trial. No credit card required to inquire.{" "}
          <a href="#contact" className="text-emerald-400 hover:underline">Contact us</a> to get started.
        </p>
      </div>
    </section>
  );
}
