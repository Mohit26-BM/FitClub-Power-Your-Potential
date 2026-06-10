import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Hero from "@/components/home/Hero";
import Plans from "@/components/home/Plans";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";
import CTA from "@/components/home/CTA";
import ContactSection from "@/components/home/ContactSection";
import AnimateIn from "@/components/ui/AnimateIn";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />

        {/* About Section */}
        <section id="about" className="py-24 bg-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text */}
              <AnimateIn from="left">
                <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 uppercase tracking-wider">
                  About FitClub
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                  More Than a Gym —
                  <span className="text-emerald-400"> A Community.</span>
                </h2>
                <p className="text-slate-400 leading-relaxed mb-4">
                  At FitClub, we believe fitness is more than lifting weights. It&apos;s
                  about building discipline, confidence, and community. Our
                  certified trainers craft personalised programmes for every
                  body type and fitness level.
                </p>
                <p className="text-slate-400 leading-relaxed mb-8">
                  With our smart member portal you can view your BMI analysis, book
                  training slots, track plan expiry, and manage payments — all
                  in one place.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Members Enrolled", value: "500+" },
                    { label: "Years of Excellence", value: "8+" },
                    { label: "Expert Trainers", value: "15+" },
                    { label: "Daily Time Slots", value: "10" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-800 rounded-xl p-4 border border-slate-700">
                      <p className="text-2xl font-bold text-emerald-400">{s.value}</p>
                      <p className="text-slate-400 text-sm mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </AnimateIn>

              {/* Image grid */}
              <AnimateIn from="right" delay={100}>
                <div className="grid grid-cols-2 gap-4 h-full">

                  {/* Left column — two stacked images */}
                  <div className="flex flex-col gap-4">
                    <div className="relative rounded-2xl overflow-hidden h-56 bg-slate-800 border border-slate-700 group cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
                      <Image
                        src="/images/about-1.jpg"
                        alt="Gym equipment"
                        fill
                        className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-all duration-300 group-hover:from-emerald-950/70" />
                      <p className="absolute bottom-3 left-4 text-white text-sm font-semibold drop-shadow-sm">Premium Equipment</p>
                    </div>
                    <div className="relative rounded-2xl overflow-hidden flex-1 min-h-44 bg-slate-800 border border-slate-700 group cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
                      <Image
                        src="/images/about-3.jpg"
                        alt="Members training"
                        fill
                        className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-all duration-300 group-hover:from-emerald-950/70" />
                      <p className="absolute bottom-3 left-4 text-white text-sm font-semibold drop-shadow-sm">Group Training</p>
                    </div>
                  </div>

                  {/* Right column — tall image + slot chips */}
                  <div className="flex flex-col gap-4">
                    <div className="relative rounded-2xl overflow-hidden flex-1 min-h-64 bg-slate-800 border border-slate-700 group cursor-pointer transition-all duration-300 hover:ring-2 hover:ring-emerald-500/40 hover:shadow-lg hover:shadow-emerald-500/10">
                      <Image
                        src="/images/about-2.jpg"
                        alt="Personal training session"
                        fill
                        className="object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent transition-all duration-300 group-hover:from-emerald-950/70" />
                      <p className="absolute bottom-3 left-4 text-white text-sm font-semibold drop-shadow-sm">Expert Trainers</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {["06:00","07:00","08:00","09:00","10:00","12:00"].map((t) => (
                        <div key={t} className="bg-slate-800/60 border border-slate-700 rounded-lg px-2 py-2 text-center hover:border-emerald-500/50 hover:bg-emerald-950/30 transition-all duration-200">
                          <span className="text-emerald-400 font-mono text-xs font-semibold">
                            {t}–{String(parseInt(t) + 1).padStart(2, "0")}:00
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              </AnimateIn>
            </div>
          </div>
        </section>

        <Plans />
        <Features />
        <Testimonials />
        <ContactSection />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
