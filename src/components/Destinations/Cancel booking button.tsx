"use client";

import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cancelBooking } from "../../lib/Bookings Actions";

export default function CancelBookingButton({
  id,
  name,
}: {
  id: string;
  name: string;
}) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleOpenChange = (next: boolean) => {
    if (loading) return;
    if (next) setError(null);
    setOpen(next);
  };

  const handleCancel = async () => {
    setLoading(true);
    setError(null);
    const result = await cancelBooking(id);
    if (!result.ok) {
      setError(result.error);
      setLoading(false);
      return;
    }
    // The server action revalidates /bookings, so the card disappears on its own.
    setLoading(false);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger
        render={
          <button
            type="button"
            className="inline-flex h-8 items-center gap-1.5 border border-red-300 bg-white px-4 text-[11px] font-medium text-red-500 transition-colors hover:bg-red-50"
          >
            <Trash2 className="size-3.5" />
            Cancel
          </button>
        }
      />

      <DialogContent className="gap-0 rounded-none p-0 sm:max-w-[480px]">
        <div className="p-7">
          <DialogHeader className="flex-row items-center gap-3 space-y-0 text-left">
            <span className="flex size-10 shrink-0 items-center justify-center rounded-md bg-red-50">
              <AlertTriangle className="size-5 text-red-500" />
            </span>
            <DialogTitle className="text-base font-medium text-[#1f1f1f]">
              Cancel Booking
            </DialogTitle>
          </DialogHeader>

          <DialogDescription className="mt-5 text-xs font-light leading-relaxed text-[#444]">
            Are you sure you want to cancel your booking for{" "}
            <strong className="font-semibold text-[#1f1f1f]">
              &ldquo;{name}&rdquo;
            </strong>
            ? This action cannot be undone.
          </DialogDescription>

          {error && (
            <p role="alert" className="mt-4 text-xs text-red-500">
              {error}
            </p>
          )}

          <div className="mt-7 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={loading}
              className="inline-flex h-10 items-center rounded-sm border border-[#d9d9d9] bg-white px-5 text-xs font-medium text-[#1f1f1f] transition-colors hover:bg-muted disabled:opacity-60"
            >
              Keep Booking
            </button>
            <button
              type="button"
              onClick={handleCancel}
              disabled={loading}
              className="inline-flex h-10 items-center gap-2 rounded-sm bg-red-500 px-5 text-xs font-medium text-white transition-colors hover:bg-red-600 disabled:opacity-60"
            >
              <Trash2 className="size-3.5" />
              {loading ? "Cancelling..." : "Cancel Booking"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
