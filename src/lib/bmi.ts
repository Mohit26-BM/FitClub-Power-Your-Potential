import type { BmiAdvice } from "@/types";

export function getBmiCategory(bmi: number): string {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 25.0) return "Normal";
  if (bmi < 30.0) return "Overweight";
  return "Obese";
}

export function getBmiAdvice(bmi: number): BmiAdvice {
  if (bmi < 18.5) {
    return {
      category: "Underweight",
      goal: "Weight Gain & Muscle Building",
      cardio: "Minimal (1-2x/week, short sessions)",
      strength: "Compound lifts — Squats, Deadlifts, Bench Press, Overhead Press",
      diet: "High-calorie, high-protein diet (500+ kcal surplus)",
      tip: "Prioritise sleep and rest days for muscle recovery.",
      color: "blue",
    };
  }
  if (bmi < 25.0) {
    return {
      category: "Normal",
      goal: "Maintenance & General Fitness",
      cardio: "3x/week — Running, Cycling, or Swimming (30 min)",
      strength: "Full-body or split routine — 3-4x/week",
      diet: "Balanced macros — protein, complex carbs, healthy fats",
      tip: "Great starting point — focus on consistency and progression.",
      color: "green",
    };
  }
  if (bmi < 30.0) {
    return {
      category: "Overweight",
      goal: "Weight Loss & Endurance",
      cardio: "4-5x/week — Treadmill, Cycling, Elliptical (45 min)",
      strength: "Light-to-moderate weights, higher reps (12-15 per set)",
      diet: "Moderate calorie deficit (~500 kcal below maintenance)",
      tip: "Track meals and stay hydrated. Avoid crash dieting.",
      color: "yellow",
    };
  }
  return {
    category: "Obese",
    goal: "Safe Weight Reduction",
    cardio: "Low-impact daily — Walking, Swimming, Stationary Bike",
    strength: "Bodyweight exercises — Chair squats, Wall push-ups, Resistance bands",
    diet: "Low-calorie, high-fibre diet. Limit processed sugar and fried food.",
    tip: "Consult a doctor before starting. Progress gradually.",
    color: "red",
  };
}

export function getBmiColor(bmi: number): string {
  if (bmi < 18.5) return "text-blue-400";
  if (bmi < 25.0) return "text-emerald-400";
  if (bmi < 30.0) return "text-yellow-400";
  return "text-red-400";
}
