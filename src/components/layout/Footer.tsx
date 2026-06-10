import { Dumbbell, Instagram, Twitter, Facebook } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl mb-4">
              <Dumbbell className="text-emerald-500" size={28} />
              <span>FitClub</span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Your premier fitness destination. We help you build the body and
              mindset of a champion with world-class equipment and expert trainers.
            </p>
            <div className="flex gap-4 mt-6">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a key={i} href="#" className="text-slate-400 hover:text-emerald-400 transition-colors">
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              {["About", "Plans", "Features", "Testimonials"].map((item) => (
                <li key={item}>
                  <a href={`#${item.toLowerCase()}`} className="hover:text-emerald-400 transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>123 Fitness Ave, Gym City</li>
              <li>+91 98765 43210</li>
              <li>hello@fitclub.com</li>
              <li>Mon-Sun: 5AM - 11PM</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} FitClub. All rights reserved.
          </p>
          <div className="flex gap-6 text-sm text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
