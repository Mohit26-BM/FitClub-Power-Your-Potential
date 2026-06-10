import { Activity, Clock, CreditCard, Dumbbell, Shield, Users } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

const FEATURES = [
  {
    icon: Dumbbell,
    title: "World-Class Equipment",
    desc: "State-of-the-art machines and free weights for every fitness level.",
  },
  {
    icon: Clock,
    title: "10 Daily Slots",
    desc: "Flexible 1-hour time slots from 6AM to 7PM, seven days a week.",
  },
  {
    icon: Activity,
    title: "BMI Tracking",
    desc: "Personalized fitness advice based on your BMI category and goals.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    desc: "Certified trainers available to guide your fitness journey.",
  },
  {
    icon: CreditCard,
    title: "Flexible Plans",
    desc: "Monthly, quarterly, and annual memberships with transparent pricing.",
  },
  {
    icon: Shield,
    title: "Secure Member Portal",
    desc: "Manage your membership, bookings, and profile securely online.",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn from="up" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            FitClub provides all the tools, equipment, and support to help you
            reach your fitness goals faster.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ icon: Icon, title, desc }, i) => (
            <AnimateIn key={title} from="up" delay={i * 80}>
              <div className="group bg-slate-800/50 border border-slate-700 hover:border-emerald-500/40 rounded-xl p-6 transition-all duration-200 h-full">
                <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center mb-4 group-hover:bg-emerald-500/20 transition-colors">
                  <Icon className="text-emerald-400" size={22} />
                </div>
                <h3 className="text-white font-semibold mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
