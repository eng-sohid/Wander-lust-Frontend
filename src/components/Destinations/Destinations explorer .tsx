"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Calendar,
  ChevronDown,
  MapPin,
  PackagePlus,
  Plane,
  Search,
  Star,
  X,
} from "lucide-react";

export type Destination = {
  _id: string;
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
  rating?: number;
};

const PRICE_RANGES = [
  { label: "Under $1,000", min: 0, max: 1000 },
  { label: "$1,000 – $2,500", min: 1000, max: 2500 },
  { label: "$2,500 – $5,000", min: 2500, max: 5000 },
  { label: "Over $5,000", min: 5000, max: Infinity },
];

const SORTS = [
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "name", label: "Name (A–Z)" },
  { value: "date", label: "Departure date" },
];

function formatDate(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  const active = value !== "";
  return (
    <div
      className={`relative border bg-white transition-colors lg:-ml-px ${
        active
          ? "border-[#1aa6cf] z-10"
          : "border-[#d9d9d9] hover:border-[#9bd6e8]"
      }`}
    >
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`h-11 w-full appearance-none bg-transparent px-3 pr-9 text-xs uppercase tracking-wide outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#1aa6cf] ${
          active ? "text-[#0f7c9c]" : "text-[#333]"
        }`}
      >
        <option value="">{label}</option>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#777]" />
    </div>
  );
}

export default function DestinationsExplorer({
  destinations,
}: {
  destinations: Destination[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("");
  const [priceRange, setPriceRange] = useState("");
  const [sortBy, setSortBy] = useState("");

  const categories = useMemo(
    () =>
      Array.from(new Set(destinations.map((d) => d.category))).filter(Boolean),
    [destinations],
  );

  const filtered = useMemo(() => {
    let list = [...destinations];
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q),
      );
    }
    if (category) list = list.filter((d) => d.category === category);
    if (priceRange !== "") {
      const r = PRICE_RANGES[Number(priceRange)];
      list = list.filter((d) => d.price >= r.min && d.price < r.max);
    }
    switch (sortBy) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name":
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "date":
        list.sort(
          (a, b) => +new Date(a.departureDate) - +new Date(b.departureDate),
        );
        break;
    }
    return list;
  }, [destinations, query, category, priceRange, sortBy]);

  const hasFilters = query || category || priceRange !== "" || sortBy;
  const clearAll = () => {
    setQuery("");
    setCategory("");
    setPriceRange("");
    setSortBy("");
  };

  return (
    <>
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .card-reveal {
            animation: card-reveal 0.6s cubic-bezier(0.22, 1, 0.36, 1) both;
            animation-delay: var(--reveal-delay, 0ms);
          }
          @keyframes card-reveal {
            from { opacity: 0; transform: translateY(18px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>

      {/* Filter bar */}
      <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:gap-0">
        <label className="relative flex items-center border border-[#d9d9d9] bg-white transition-colors focus-within:z-10 focus-within:border-[#1aa6cf] hover:border-[#9bd6e8]">
          <Search className="pointer-events-none absolute left-3 size-4 text-[#777]" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search destination or country"
            aria-label="Search destinations"
            className="h-11 w-full bg-transparent pl-9 pr-3 text-xs text-[#333] outline-none placeholder:text-[#999]"
          />
        </label>
        <FilterSelect label="Category" value={category} onChange={setCategory}>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect
          label="Price range"
          value={priceRange}
          onChange={setPriceRange}
        >
          {PRICE_RANGES.map((r, i) => (
            <option key={r.label} value={i}>
              {r.label}
            </option>
          ))}
        </FilterSelect>
        <FilterSelect label="Sort by" value={sortBy} onChange={setSortBy}>
          {SORTS.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </FilterSelect>
      </div>

      <div className="mt-4 flex min-h-6 items-center justify-between">
        <p className="text-xs text-[#555]" aria-live="polite">
          Showing {filtered.length} destination
          {filtered.length === 1 ? "" : "s"}
        </p>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="inline-flex items-center gap-1 text-xs text-[#1aa6cf] hover:text-[#0f7c9c]"
          >
            <X className="size-3" />
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-6 flex flex-col items-center border border-dashed border-[#d9d9d9] px-6 py-20 text-center">
          <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#e8f6fb]">
            <Plane className="size-6 text-[#1aa6cf]" />
          </div>
          <h2 className="text-lg font-medium text-[#1f1f1f]">
            No destinations found
          </h2>
          <p className="mt-1 max-w-sm text-sm text-[#666]">
            Nothing matches those filters. Clear them to see every package, or
            add a new one.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {hasFilters && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex h-10 items-center border border-[#d9d9d9] px-4 text-sm text-[#333] hover:bg-muted"
              >
                Clear filters
              </button>
            )}
            <Link
              href="/add-destination"
              className="inline-flex h-10 items-center gap-2 bg-[#1aa6cf] px-4 text-sm font-medium text-white hover:bg-[#1499c5]"
            >
              <PackagePlus className="size-4" />
              Add Destination
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-5 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((d, i) => (
            <article
              key={d._id}
              className="card-reveal"
              style={{
                ["--reveal-delay" as string]: `${Math.min(i, 8) * 60}ms`,
              }}
            >
              <Link
                href={`/destinations/${d._id}`}
                className="group block outline-none"
              >
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden bg-muted ring-offset-2 group-focus-visible:ring-2 group-focus-visible:ring-[#1aa6cf]">
                  {d.imageUrl ? (
                    <Image
                      src={d.imageUrl}
                      alt={d.name}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.07]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <PackagePlus className="size-10 text-muted-foreground/50" />
                    </div>
                  )}

                  {/* Category */}
                  {d.category && (
                    <span className="absolute left-2 top-2 bg-[#1aa6cf] px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white">
                      {d.category}
                    </span>
                  )}

                  {/* Rating */}
                  <div className="absolute right-2 top-2 flex items-center gap-1 bg-white/85 px-2 py-1 text-[11px] font-medium text-[#1f1f1f] backdrop-blur-sm">
                    {(d.rating ?? 4.5).toFixed(1)}
                    <Star className="size-3 fill-amber-400 text-amber-400" />
                  </div>

                  {/* Hover reveal: the description slides up over the photo */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 via-black/55 to-transparent px-4 pb-4 pt-12 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100 group-focus-visible:translate-y-0 group-focus-visible:opacity-100"
                  >
                    <p className="line-clamp-2 text-xs leading-relaxed text-white/95">
                      {d.description}
                    </p>
                  </div>
                </div>

                {/* Meta */}
                <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#555]">
                  <MapPin className="size-3" />
                  {d.country}
                </div>

                <div className="mt-1.5 flex items-baseline justify-between gap-3">
                  <h3 className="truncate text-[15px] text-[#1f1f1f] transition-colors group-hover:text-[#0f7c9c]">
                    {d.name}
                  </h3>
                  <span className="shrink-0 text-[15px] font-semibold text-[#1f1f1f]">
                    ${d.price.toLocaleString("en-US")}
                    <span className="text-[10px] font-normal text-[#777]">
                      /Person
                    </span>
                  </span>
                </div>

                <div className="mt-1.5 flex items-center gap-4 text-[11px] text-[#555]">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="size-3" />
                    {d.duration}
                  </span>
                  <span className="text-[#888]">
                    Departs {formatDate(d.departureDate)}
                  </span>
                </div>

                {/* CTA with growing underline */}
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] uppercase tracking-wide text-[#1aa6cf]">
                  <span className="relative pb-px">
                    Book now
                    <span className="absolute inset-x-0 bottom-0 h-px bg-[#1aa6cf]/40" />
                    <span className="absolute bottom-0 left-0 h-px w-0 bg-[#1aa6cf] transition-all duration-300 group-hover:w-full" />
                  </span>
                  <ArrowUpRight className="size-3 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
