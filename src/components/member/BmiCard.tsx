import { getBmiAdvice, getBmiColor } from "@/lib/bmi";
import { Card, CardTitle } from "@/components/ui/Card";
import { Activity } from "lucide-react";

interface Props {
  bmi: number;
}

const COLOR_MAP: Record<string, string> = {
  blue:   "from-blue-500/10 border-blue-500/20 text-blue-400",
  green:  "from-emerald-500/10 border-emerald-500/20 text-emerald-400",
  yellow: "from-yellow-500/10 border-yellow-500/20 text-yellow-400",
  red:    "from-red-500/10 border-red-500/20 text-red-400",
};

export default function BmiCard({ bmi }: Props) {
  const advice = getBmiAdvice(bmi);
  const colors = COLOR_MAP[advice.color] ?? COLOR_MAP.green;

  return (
    <Card>
      <div className="flex items-center gap-3 mb-6">
        <div className={`w-10 h-10 rounded-xl border bg-gradient-to-br flex items-center justify-center ${colors}`}>
          <Activity size={20} />
        </div>
        <div>
          <CardTitle>BMI & Fitness Advice</CardTitle>
          <p className="text-slate-500 text-xs">Based on your current BMI</p>
        </div>
      </div>

      <div className="flex items-center gap-6 mb-6 p-4 bg-slate-900 rounded-xl border border-slate-700">
        <div>
          <p className="text-slate-400 text-xs mb-1">Your BMI</p>
          <p className={`text-4xl font-bold ${getBmiColor(bmi)}`}>{bmi.toFixed(1)}</p>
        </div>
        <div className="border-l border-slate-700 pl-6">
          <p className="text-slate-400 text-xs mb-1">Category</p>
          <p className={`text-lg font-semibold ${getBmiColor(bmi)}`}>{advice.category}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {[
          { label: "Goal",     value: advice.goal },
          { label: "Cardio",   value: advice.cardio },
          { label: "Strength", value: advice.strength },
          { label: "Diet",     value: advice.diet },
        ].map(({ label, value }) => (
          <div key={label} className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
            <p className="text-slate-500 text-xs mb-1">{label}</p>
            <p className="text-slate-200 text-sm">{value}</p>
          </div>
        ))}
      </div>

      <div className="mt-4 bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
        <p className="text-emerald-400 text-sm">
          <strong>Tip:</strong> {advice.tip}
        </p>
      </div>
    </Card>
  );
}
