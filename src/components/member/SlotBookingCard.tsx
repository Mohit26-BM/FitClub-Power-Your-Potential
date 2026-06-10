"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { bookSlot, cancelBooking } from "@/actions/slot.actions";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Clock } from "lucide-react";
import type { SlotRow } from "@/types";

interface Props {
  slots: SlotRow[];
  currentBookingSlotId: string | null;
}

export default function SlotBookingCard({ slots, currentBookingSlotId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function act(fn: () => Promise<unknown>) {
    startTransition(async () => {
      await fn();
      router.refresh();
    });
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {slots.map((slot) => {
        const count   = slot.bookings.length;
        const pct     = Math.round((count / slot.capacity) * 100);
        const isFull  = count >= slot.capacity;
        const isBooked= currentBookingSlotId === slot.id;
        const status  = isFull ? "full" : count >= slot.capacity * 0.75 ? "almost" : "open";

        return (
          <div
            key={slot.id}
            className={`bg-slate-800 border rounded-xl p-5 transition-all ${
              isBooked ? "border-emerald-500 ring-1 ring-emerald-500/30" : "border-slate-700 hover:border-slate-600"
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Clock size={16} className={isBooked ? "text-emerald-400" : "text-slate-400"} />
                <span className={`font-mono font-semibold ${isBooked ? "text-emerald-400" : "text-white"}`}>
                  {slot.startTime} – {slot.endTime}
                </span>
              </div>
              {isBooked && <Badge variant="success">My Slot</Badge>}
              {!isBooked && (
                <Badge variant={status === "full" ? "danger" : status === "almost" ? "warning" : "success"}>
                  {status === "full" ? "Full" : status === "almost" ? "Almost Full" : "Open"}
                </Badge>
              )}
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-xs text-slate-500 mb-1">
                <span>Occupancy</span><span>{count}/{slot.capacity}</span>
              </div>
              <div className="bg-slate-700 rounded-full h-1.5">
                <div
                  className={`h-1.5 rounded-full ${isFull ? "bg-red-500" : status === "almost" ? "bg-yellow-500" : "bg-emerald-500"}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {isBooked ? (
              <Button
                variant="danger"
                size="sm"
                className="w-full"
                loading={isPending}
                onClick={() => act(() => cancelBooking())}
              >
                Cancel Booking
              </Button>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                disabled={isFull || !!currentBookingSlotId || isPending}
                loading={isPending}
                onClick={() => act(() => bookSlot(slot.id))}
              >
                {isFull
                  ? "Slot Full"
                  : currentBookingSlotId
                  ? "Cancel current to re-book"
                  : "Book Slot"}
              </Button>
            )}
          </div>
        );
      })}
    </div>
  );
}
