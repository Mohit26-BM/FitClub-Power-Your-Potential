"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, Users } from "lucide-react";
import { markAttendance, removeAttendance } from "@/actions/attendance.actions";
import { cn } from "@/lib/utils";

interface MemberRow {
  id: string;
  memberId: string;
  name: string;
  booking: {
    slot: { startTime: string; endTime: string };
  } | null;
}

interface AttendanceRecord {
  memberId: string;
  slotId: string | null;
}

interface Props {
  members: MemberRow[];
  attendanceRecords: AttendanceRecord[];
  initialDate: string;
}

export default function AttendanceManager({ members, attendanceRecords, initialDate }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [presentSet, setPresentSet] = useState<Set<string>>(
    () => new Set(attendanceRecords.map((r) => r.memberId))
  );
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const handleDateChange = useCallback(
    (date: string) => {
      setSelectedDate(date);
      router.push(`/admin/attendance?date=${date}`);
    },
    [router]
  );

  async function toggleAttendance(member: MemberRow) {
    const isPresent = presentSet.has(member.id);
    setLoadingIds((prev) => new Set(prev).add(member.id));

    // Optimistic update
    setPresentSet((prev) => {
      const next = new Set(prev);
      if (isPresent) next.delete(member.id);
      else next.add(member.id);
      return next;
    });

    const date = new Date(selectedDate);
    date.setUTCHours(0, 0, 0, 0);

    startTransition(async () => {
      if (isPresent) {
        await removeAttendance(member.id, date);
      } else {
        const slotId = member.booking
          ? (attendanceRecords.find((r) => r.memberId === member.id)?.slotId ?? undefined)
          : undefined;
        await markAttendance(member.id, date, slotId);
      }
      setLoadingIds((prev) => {
        const next = new Set(prev);
        next.delete(member.id);
        return next;
      });
    });
  }

  const presentCount = presentSet.size;
  const totalCount = members.length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => handleDateChange(e.target.value)}
            max={new Date().toISOString().split("T")[0]}
            className="rounded-lg bg-slate-800 border border-slate-600 hover:border-slate-500 px-3 py-2.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors"
          />
        </div>

        <div className="sm:ml-auto flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-300">
              Present: <span className="font-semibold text-white">{presentCount}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-slate-600" />
            <span className="text-slate-300">
              Absent: <span className="font-semibold text-white">{totalCount - presentCount}</span>
            </span>
          </div>
        </div>
      </div>

      {members.length === 0 ? (
        <div className="text-center py-16">
          <Users className="text-slate-600 mx-auto mb-3" size={40} />
          <p className="text-slate-400 font-medium">No members found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-700">
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">Member Name</th>
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">Member ID</th>
                <th className="text-left text-slate-400 font-medium pb-3 pr-4">Booked Slot</th>
                <th className="text-center text-slate-400 font-medium pb-3">Present</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {members.map((member) => {
                const isPresent = presentSet.has(member.id);
                const isLoading = loadingIds.has(member.id);

                return (
                  <tr
                    key={member.id}
                    className={cn(
                      "transition-colors",
                      isPresent ? "bg-emerald-500/5" : ""
                    )}
                  >
                    <td className="py-3 pr-4 text-white font-medium">{member.name}</td>
                    <td className="py-3 pr-4 text-slate-400 font-mono">{member.memberId}</td>
                    <td className="py-3 pr-4">
                      {member.booking ? (
                        <span className="text-slate-300 font-mono text-xs">
                          {member.booking.slot.startTime} – {member.booking.slot.endTime}
                        </span>
                      ) : (
                        <span className="text-slate-600 text-xs">No slot booked</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      <button
                        onClick={() => toggleAttendance(member)}
                        disabled={isLoading || isPending}
                        className={cn(
                          "inline-flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                          isPresent
                            ? "text-emerald-400 hover:text-emerald-300"
                            : "text-slate-600 hover:text-slate-400"
                        )}
                        title={isPresent ? "Mark absent" : "Mark present"}
                      >
                        {isPresent ? (
                          <CheckCircle2 size={22} />
                        ) : (
                          <Circle size={22} />
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
