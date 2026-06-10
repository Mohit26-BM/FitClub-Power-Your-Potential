export type Role = "admin" | "member";

export type Plan = "MONTHLY" | "QUARTERLY" | "ANNUAL";

export interface MemberRow {
  id: string;
  memberId: string;
  name: string;
  mobile: string;
  bmi: number;
  joinDate: Date;
  expiryDate: Date;
  plan: Plan;
  feePaid: boolean;
  booking: {
    id: string;
    slotId: string;
    slot: { startTime: string; endTime: string };
  } | null;
  createdAt: Date;
}

export interface SlotRow {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  bookings: Array<{
    id: string;
    member: { id: string; memberId: string; name: string };
  }>;
}

export interface BmiAdvice {
  category: string;
  goal: string;
  cardio: string;
  strength: string;
  diet: string;
  tip: string;
  color: string;
}

export const PLAN_LABELS: Record<Plan, string> = {
  MONTHLY: "Monthly",
  QUARTERLY: "Quarterly",
  ANNUAL: "Annual",
};

export const PLAN_FEES: Record<Plan, number> = {
  MONTHLY: 2499,
  QUARTERLY: 6499,
  ANNUAL: 21999,
};

export const PLAN_SAVINGS: Record<Plan, number> = {
  MONTHLY:   0,
  QUARTERLY: 2499 * 3 - 6499,   // 998
  ANNUAL:    2499 * 12 - 21999,  // 7989
};

export const PLAN_DURATIONS: Record<Plan, { months?: number; years?: number }> = {
  MONTHLY: { months: 1 },
  QUARTERLY: { months: 3 },
  ANNUAL: { years: 1 },
};
