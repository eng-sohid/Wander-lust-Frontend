"use client";

import { useState } from "react";
import { ArrowRight, Check, Minus, Plus } from "lucide-react";

type Props = {
  id: string;
  name: string;
  price: number;
  dateLabel: string | null;
  perks: string[];
};

const MIN = 1;
const MAX = 10;

export default function BookingCard({
  id,
  name,
  price,
  dateLabel,
  perks,
}: Props) {
  const [travelers, setTravelers] = useState(1);
  const total = price * travelers;
  const fmt = (n: number) => `$${n.toLocaleString("en-US")}`;

  // TODO: replace with your real booking action (e.g. router.push(`/bookings/new?destination=${id}&travelers=${travelers}`))
  const handleBook = () => {
    console.log("Book", { id, name, travelers, total });
  };

  return (
    <>
      <aside className="h-fit border border-[#ececec] bg-white p-5 shadow-[0_8px_30px_rgba(0,0,0,0.08)] lg:sticky lg:top-6">
        <p className="text-[11px] font-light text-[#777]">Starting from</p>
        <p className="mt-1 text-3xl font-medium tracking-tight text-[#1aa6cf]">
          {fmt(price)}
        </p>
        <p className="mt-0.5 text-[11px] font-light text-[#777]">per person</p>

        {dateLabel && (
          <div className="mt-5 bg-[#f4f4f4] px-3 py-3 text-xs font-light text-[#333]">
            {dateLabel}
          </div>
        )}

        {/* Travelers */}
        <div className="mt-3 flex items-center justify-between bg-[#f4f4f4] px-3 py-2">
          <span className="text-xs font-light text-[#333]">Travelers</span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTravelers((t) => Math.max(MIN, t - 1))}
              disabled={travelers <= MIN}
              aria-label="Remove a traveler"
              className="flex size-7 items-center justify-center border border-[#d9d9d9] bg-white text-[#333] transition-colors hover:border-[#1aa6cf] hover:text-[#1aa6cf] disabled:opacity-40 disabled:hover:border-[#d9d9d9] disabled:hover:text-[#333]"
            >
              <Minus className="size-3.5" />
            </button>
            <span
              className="w-4 text-center text-sm font-medium tabular-nums"
              aria-live="polite"
            >
              {travelers}
            </span>
            <button
              type="button"
              onClick={() => setTravelers((t) => Math.min(MAX, t + 1))}
              disabled={travelers >= MAX}
              aria-label="Add a traveler"
              className="flex size-7 items-center justify-center border border-[#d9d9d9] bg-white text-[#333] transition-colors hover:border-[#1aa6cf] hover:text-[#1aa6cf] disabled:opacity-40 disabled:hover:border-[#d9d9d9] disabled:hover:text-[#333]"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-baseline justify-between border-t border-[#ececec] pt-4">
          <span className="text-xs font-light text-[#555]">
            Total for {travelers} {travelers === 1 ? "traveler" : "travelers"}
          </span>
          <span className="text-lg font-semibold tabular-nums text-[#1f1f1f]">
            {fmt(total)}
          </span>
        </div>

        <button
          type="button"
          onClick={handleBook}
          className="group mt-4 flex h-11 w-full items-center justify-center gap-2 bg-[#17a2c4] text-xs font-medium text-white transition-colors hover:bg-[#1499c5] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#17a2c4]"
        >
          Book Now
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
        </button>

        <ul className="mt-4 space-y-2">
          {perks.map((p) => (
            <li
              key={p}
              className="flex items-center gap-2 text-[11px] font-light text-[#555]"
            >
              <Check className="size-3.5 shrink-0 text-green-600" />
              {p}
            </li>
          ))}
        </ul>
      </aside>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 flex items-center justify-between gap-4 border-t border-[#ececec] bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <div>
          <p className="text-[10px] font-light text-[#777]">
            Total for {travelers}
          </p>
          <p className="text-lg font-semibold tabular-nums text-[#1aa6cf]">
            {fmt(total)}
          </p>
        </div>
        <button
          type="button"
          onClick={handleBook}
          className="flex h-10 items-center gap-2 bg-[#17a2c4] px-6 text-xs font-medium text-white hover:bg-[#1499c5]"
        >
          Book Now
          <ArrowRight className="size-4" />
        </button>
      </div>
    </>
  );
}
