"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  PackagePlus,
  Star,
} from "lucide-react";

export type FeaturedDestination = {
  _id: string;
  name: string;
  country: string;
  price: number;
  duration: string;
  imageUrl: string;
  rating?: number;
};

export default function FeaturedCarousel({
  destinations,
}: {
  destinations: FeaturedDestination[];
}) {
  const trackRef = useRef<HTMLUListElement>(null);
  const [index, setIndex] = useState(0);
  const [atStart, setAtStart] = useState(true);
  const [atEnd, setAtEnd] = useState(false);
  const total = destinations.length;

  const getStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 0;
    if (track.children.length < 2) return track.clientWidth;
    return (
      (track.children[1] as HTMLElement).offsetLeft -
      (track.children[0] as HTMLElement).offsetLeft
    );
  }, []);

  const update = useCallback(() => {
    const track = trackRef.current;
    if (!track) return;
    const step = getStep() || 1;
    const start = track.scrollLeft <= 2;
    const end = track.scrollLeft + track.clientWidth >= track.scrollWidth - 2;
    setAtStart(start);
    setAtEnd(end);
    setIndex(end ? total - 1 : Math.round(track.scrollLeft / step));
  }, [getStep, total]);

  useEffect(() => {
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    track.scrollBy({
      left: direction * getStep(),
      behavior: reduce ? "auto" : "smooth",
    });
  };

  const navButton =
    "flex size-9 items-center justify-center rounded-full border border-[#d9d9d9] text-[#555] transition-colors hover:border-[#1aa6cf] hover:text-[#1aa6cf] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-[#d9d9d9] disabled:hover:text-[#555]";

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Featured destinations"
      className="[container-type:inline-size]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-[clamp(1.9rem,3.5vw,2.75rem)] font-light leading-tight tracking-[-0.03em] text-[#1f1f1f]">
            Featured Destinations
          </h2>
          <p className="mt-1.5 text-xs font-light text-[#444]">
            Handpicked travel experiences for the adventure seekers
          </p>
        </div>
        <Link
          href="/destinations"
          className="group inline-flex h-9 shrink-0 items-center gap-2 border border-[#1aa6cf] px-4 text-[11px] uppercase tracking-wide text-[#1aa6cf] transition-colors hover:bg-[#1aa6cf] hover:text-white"
        >
          All Destinations
          <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Track: bleeds to the right edge of the screen so the next card peeks in */}
      <ul
        ref={trackRef}
        onScroll={update}
        style={{
          marginRight: "calc(50% - 50vw)",
          paddingRight: "calc(50vw - 50%)",
        }}
        className="mt-7 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {destinations.map((d, i) => (
          <li
            key={d._id}
            aria-label={`${i + 1} of ${total}`}
            className="w-[82cqw] shrink-0 snap-start sm:w-[calc((100cqw-0.75rem)/2)]"
          >
            <Link
              href={`/destinations/${d._id}`}
              className="group block outline-none"
            >
              <div className="relative aspect-[1.57/1] overflow-hidden bg-muted ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-[#1aa6cf]">
                {d.imageUrl ? (
                  <Image
                    src={d.imageUrl}
                    alt={d.name}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                    sizes="(max-width: 640px) 82vw, 50vw"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <PackagePlus className="size-10 text-muted-foreground/50" />
                  </div>
                )}
                <div className="absolute right-2.5 top-2.5 flex items-center gap-1 bg-white/85 px-2 py-1 text-[11px] font-medium text-[#1f1f1f] backdrop-blur-sm">
                  {(d.rating ?? 4.5).toFixed(1)}
                  <Star className="size-3 fill-current" />
                </div>
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-[11px] font-light text-[#555]">
                <MapPin className="size-3" />
                {d.country}
              </div>

              <div className="mt-1.5 flex items-baseline justify-between gap-3">
                <h3 className="truncate text-lg font-normal text-[#1f1f1f] transition-colors group-hover:text-[#0f7c9c]">
                  {d.name}
                </h3>
                <span className="shrink-0 text-lg font-medium text-[#1f1f1f]">
                  ${d.price.toLocaleString("en-US")}
                  <span className="text-[10px] font-normal text-[#777]">
                    /Person
                  </span>
                </span>
              </div>

              <div className="mt-1 flex items-center gap-1.5 text-[11px] font-light text-[#555]">
                <Calendar className="size-3" />
                {d.duration}
              </div>

              <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#1aa6cf]">
                <span className="relative pb-px">
                  Book now
                  <span className="absolute inset-x-0 bottom-0 h-px bg-[#1aa6cf]/40" />
                  <span className="absolute bottom-0 left-0 h-px w-0 bg-[#1aa6cf] transition-all duration-300 group-hover:w-full" />
                </span>
                <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Footer: counter, progress, arrows */}
      <div className="mt-5 flex items-center gap-5">
        <span
          className="text-sm tabular-nums text-[#1f1f1f]"
          aria-live="polite"
        >
          {index + 1}/{total}
        </span>
        <div className="h-px flex-1 bg-[#e5e5e5]">
          <div
            className="h-px bg-[#1aa6cf] transition-[width] duration-300"
            style={{ width: `${((index + 1) / total) * 100}%` }}
          />
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => scrollByCard(-1)}
            disabled={atStart}
            aria-label="Previous destination"
            className={navButton}
          >
            <ArrowLeft className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollByCard(1)}
            disabled={atEnd}
            aria-label="Next destination"
            className={navButton}
          >
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
