import { Star } from "lucide-react";
import AnimateIn from "@/components/ui/AnimateIn";

const TESTIMONIALS = [
  {
    name: "Rahul Sharma",
    role: "Member since 2023",
    text: "FitClub completely transformed my lifestyle. Lost 15kg in 6 months with personalized guidance. The slot booking system makes it so easy to plan my workouts.",
    rating: 5,
    avatar: "RS",
  },
  {
    name: "Priya Patel",
    role: "Annual Member",
    text: "The BMI tracking and fitness recommendations are incredibly helpful. The trainers know exactly what they're doing, and the facilities are top-notch.",
    rating: 5,
    avatar: "PP",
  },
  {
    name: "Arjun Mehta",
    role: "Member since 2022",
    text: "Been a member for two years. The online member portal makes managing my membership effortless. The quarterly plan offers great value for money.",
    rating: 5,
    avatar: "AM",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimateIn from="up" className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            What Our Members Say
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Real results from real people. Join hundreds of members who have
            already transformed their lives.
          </p>
        </AnimateIn>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t, i) => (
            <AnimateIn key={t.name} from="up" delay={i * 100}>
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-full">
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} size={16} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                    <span className="text-emerald-400 font-semibold text-sm">{t.avatar}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-slate-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </AnimateIn>
          ))}
        </div>
      </div>
    </section>
  );
}
