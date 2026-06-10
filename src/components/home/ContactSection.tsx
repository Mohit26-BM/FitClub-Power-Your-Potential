"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { submitInquiry } from "@/actions/contact.actions";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { CheckCircle, MapPin, Phone, Mail, Clock } from "lucide-react";

const PLAN_OPTIONS = [
  { value: "MONTHLY",   label: "Monthly — ₹2,499/month" },
  { value: "QUARTERLY", label: "Quarterly — ₹6,499/3 months" },
  { value: "ANNUAL",    label: "Annual — ₹21,999/year" },
];

const CONTACT_INFO = [
  { icon: MapPin, label: "Address",  value: "123 Fitness Avenue, Sector 14, Gym City" },
  { icon: Phone,  label: "Phone",    value: "+91 98765 43210" },
  { icon: Mail,   label: "Email",    value: "hello@fitclub.com" },
  { icon: Clock,  label: "Hours",    value: "Mon – Sun: 6:00 AM – 7:00 PM" },
];

export default function ContactSection() {
  const [done, setDone] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { plan: "MONTHLY" },
  });

  async function onSubmit(data: ContactInput) {
    const result = await submitInquiry(data);
    if (result.success) {
      setSubmittedName(data.name);
      setDone(true);
    }
  }

  return (
    <section id="contact" className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="inline-block bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            Join FitClub
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Start? Get in Touch.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Submit your interest and our team will reach out within 24 hours
            with your member ID, onboarding details, and a free trial pass.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6">
              <h3 className="text-white font-semibold text-lg mb-6">Contact Information</h3>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center flex-shrink-0">
                      <Icon size={16} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                      <p className="text-slate-200 text-sm">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-2xl p-6">
              <h4 className="text-white font-semibold mb-3">What happens next?</h4>
              <ol className="space-y-3">
                {[
                  "We review your inquiry within 24 hours",
                  "Our team calls you to confirm your preferred plan",
                  "We create your Member ID and send you login details",
                  "Walk in on your first day — your slot is ready!",
                ].map((step, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {step}
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8">
              {done ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="text-emerald-400" size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">
                    Thanks, {submittedName}!
                  </h3>
                  <p className="text-slate-400 mb-6">
                    Your membership inquiry has been received. We will call or
                    email you within 24 hours with your Member ID and a
                    complimentary trial-day pass.
                  </p>
                  <div className="bg-slate-900 border border-slate-700 rounded-xl p-4 text-left text-sm space-y-2">
                    <p className="text-slate-400">
                      <span className="text-white font-medium">Walk-in address:</span>{" "}
                      123 Fitness Avenue, Sector 14, Gym City
                    </p>
                    <p className="text-slate-400">
                      <span className="text-white font-medium">Call us:</span>{" "}
                      +91 98765 43210
                    </p>
                    <p className="text-slate-400">
                      <span className="text-white font-medium">Hours:</span>{" "}
                      Mon – Sun, 6:00 AM – 7:00 PM
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register("name")}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      placeholder="john@email.com"
                      error={errors.email?.message}
                      {...register("email")}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Phone Number"
                      placeholder="9876543210"
                      error={errors.phone?.message}
                      {...register("phone")}
                      hint="10-13 digits"
                    />
                    <div>
                      <label className="block text-sm font-medium text-slate-300 mb-1.5">
                        Interested Plan
                      </label>
                      <select
                        className="w-full rounded-lg bg-slate-900 border border-slate-600 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        {...register("plan")}
                      >
                        {PLAN_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                      {errors.plan && (
                        <p className="mt-1 text-xs text-red-400">{errors.plan.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1.5">
                      Message <span className="text-slate-500">(goals, questions, preferred slot time…)</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="I want to lose weight and build muscle. Prefer morning slots…"
                      className={`w-full rounded-lg bg-slate-900 border px-3 py-2.5 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none transition-colors ${
                        errors.message ? "border-red-500" : "border-slate-600 hover:border-slate-500"
                      }`}
                      {...register("message")}
                    />
                    {errors.message && (
                      <p className="mt-1 text-xs text-red-400">{errors.message.message}</p>
                    )}
                  </div>

                  <Button type="submit" size="lg" className="w-full" loading={isSubmitting}>
                    Send Inquiry — We'll respond within 24h
                  </Button>

                  <p className="text-center text-slate-500 text-xs">
                    By submitting, you agree to be contacted by FitClub staff. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
