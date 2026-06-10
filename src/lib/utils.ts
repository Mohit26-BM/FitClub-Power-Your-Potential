import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addMonths, addYears, isPast, format } from "date-fns";
import type { Plan } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calcExpiryDate(joinDate: Date, plan: Plan): Date {
  if (plan === "MONTHLY")   return addMonths(joinDate, 1);
  if (plan === "QUARTERLY") return addMonths(joinDate, 3);
  return addYears(joinDate, 1);
}

export function isExpired(date: Date): boolean {
  return isPast(date);
}

export function formatDate(date: Date): string {
  return format(date, "dd/MM/yyyy");
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function getMembershipStatus(
  feePaid: boolean,
  expiryDate: Date
): { label: string; color: string } {
  if (isExpired(expiryDate)) return { label: "Expired", color: "text-red-400" };
  if (!feePaid) return { label: "Unpaid", color: "text-yellow-400" };
  return { label: "Active", color: "text-emerald-400" };
}
