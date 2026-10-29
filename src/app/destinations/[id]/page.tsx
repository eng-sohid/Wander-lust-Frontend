import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock,
  MapPin,
  PackagePlus,
  Pencil,
  Star,
  Tag,
} from "lucide-react";

import DeleteButton from "../../../components/Destinations/Delete button";
import BookingCard from "../../../components/Destinations/Booking card ";
import EditDestinationDialog from "@/components/Destinations/EditDestinationDialog";

import { getAuthHeaders } from "@/lib/Api";

type Destination = {
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
  reviewCount?: number;
  highlights?: string[];
};

const DEFAULT_HIGHLIGHTS = [
  "Luxury beachfront accommodation",
  "Visit Uluwatu Temple at sunset",
  "Traditional Balinese spa treatment",
  "Private beach dinner experience",
  "Sunrise trek to Mount Batur",
];

const NOW = new Date();

const PERKS = [
  "Free cancellation up to 7 days",
  "Travel insurance included",
  "24/7 customer support",
];

const DestinationDetailsPage = async (
  props: PageProps<"/destinations/[id]">,
) => {
  const { id } = await props.params;

  let destination: Destination | null = null;
  let error: string | null = null;

  try {
    const authHeaders = await getAuthHeaders();
    if (!authHeaders) throw new Error("You need to log in to see this page");

    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/destination/${id}`,
      {
        cache: "no-store",
        headers: authHeaders,
      },
    );
    if (!res.ok) throw new Error("Failed to fetch destination");
    destination = await res.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  const d = destination;
  const highlights = d?.highlights?.length ? d.highlights : DEFAULT_HIGHLIGHTS;
  const rating = d?.rating ?? 4.9;

  let shortDate: string | null = null; // 05/15/2026
  let longDate: string | null = null; // May 15, 2026
  let departsIn: string | null = null;
  if (d?.departureDate) {
    const date = new Date(d.departureDate);
    if (isNaN(date.getTime())) {
      shortDate = longDate = d.departureDate;
    } else {
      shortDate = date.toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
        timeZone: "UTC",
      });
      longDate = date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
      });
      const days = Math.ceil((date.getTime() - NOW.getTime()) / 86_400_000);
      if (days > 1) departsIn = `Departs in ${days} days`;
      else if (days === 1) departsIn = "Departs tomorrow";
      else if (days === 0) departsIn = "Departs today";
    }
  }

  return (
    <main className="min-h-screen bg-white px-4 pb-28 pt-6 sm:px-6 lg:px-8 lg:pb-16">
      <style>{`
        @media (prefers-reduced-motion: no-preference) {
          .hero-reveal { animation: hero-reveal 1.4s cubic-bezier(0.22, 1, 0.36, 1) both; }
          .content-reveal { animation: content-reveal 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.15s both; }
          @keyframes hero-reveal { from { transform: scale(1.08); } to { transform: scale(1); } }
          @keyframes content-reveal {
            from { opacity: 0; transform: translateY(14px); }
            to { opacity: 1; transform: translateY(0); }
          }
        }
      `}</style>

      <div className="mx-auto max-w-5xl">
        {/* Top bar */}
        <div className="mb-4 flex items-center justify-between">
          <Link
            href="/destinations"
            className="group inline-flex items-center gap-2 text-sm font-light text-[#666] transition-colors hover:text-[#1f1f1f]"
          >
            <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5" />
            Back to Destinations
          </Link>

          {d && (
            <div className="flex items-center gap-2">
              <EditDestinationDialog destination={d} />
              <DeleteButton id={d._id} name={d.name} />
            </div>
          )}
        </div>

        {error || !d ? (
          <div className="mt-8 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>Error loading destination: {error ?? "Destination not found"}</p>
          </div>
        ) : (
          <>
            {/* Hero */}
            <div className="relative aspect-[2.2/1] min-h-[220px] w-full overflow-hidden bg-muted">
              {d.imageUrl ? (
                <Image
                  src={d.imageUrl}
                  alt={d.name}
                  fill
                  priority
                  className="hero-reveal object-cover"
                  sizes="(max-width: 1024px) 100vw, 1024px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <PackagePlus className="size-10 text-muted-foreground/50" />
                </div>
              )}

              <div
                aria-hidden
                className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/45 to-transparent"
              />

              {d.category && (
                <span className="absolute left-4 top-4 bg-[#1aa6cf] px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide text-white">
                  {d.category}
                </span>
              )}

              {departsIn && (
                <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 bg-white/90 px-3 py-1.5 text-xs font-medium text-[#1f1f1f] backdrop-blur-sm">
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full rounded-full bg-green-500 opacity-60 motion-safe:animate-ping" />
                    <span className="relative inline-flex size-2 rounded-full bg-green-600" />
                  </span>
                  {departsIn}
                </span>
              )}
            </div>

            <div className="content-reveal mt-8 grid gap-10 lg:grid-cols-[1fr_300px]">
              {/* Left column */}
              <div>
                <div className="flex items-center gap-1.5 text-xs font-light text-[#444]">
                  <MapPin className="size-3.5" />
                  {d.country}
                </div>

                <h1 className="mt-1 text-[clamp(2.4rem,5vw,3.5rem)] font-light leading-[1.05] tracking-[-0.035em] text-[#1f1f1f]">
                  {d.name}
                </h1>

                <div className="mt-3 flex items-center gap-2 text-sm text-[#333]">
                  <span
                    className="flex items-center gap-0.5"
                    aria-label={`${rating.toFixed(1)} out of 5 stars`}
                  >
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`size-4 ${
                          rating >= n - 0.25
                            ? "fill-green-600 text-green-600"
                            : "fill-transparent text-[#cfcfcf]"
                        }`}
                      />
                    ))}
                  </span>
                  <strong className="font-semibold">{rating.toFixed(1)}</strong>
                  <span className="font-light text-[#777]">
                    ({d.reviewCount ?? 234} reviews)
                  </span>
                </div>

                {/* Quick facts */}
                <dl className="mt-7 grid grid-cols-1 divide-y divide-[#ececec] border-y border-[#ececec] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                  <div className="flex items-center gap-3 py-4 sm:px-5 sm:first:pl-0">
                    <Clock className="size-5 shrink-0 text-[#1aa6cf]" />
                    <div>
                      <dt className="text-[11px] font-light text-[#777]">
                        Duration
                      </dt>
                      <dd className="text-sm font-medium text-[#1f1f1f]">
                        {d.duration}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-4 sm:px-5">
                    <CalendarDays className="size-5 shrink-0 text-[#1aa6cf]" />
                    <div>
                      <dt className="text-[11px] font-light text-[#777]">
                        Departure
                      </dt>
                      <dd className="text-sm font-medium text-[#1f1f1f]">
                        {longDate}
                      </dd>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 py-4 sm:px-5">
                    <Tag className="size-5 shrink-0 text-[#1aa6cf]" />
                    <div>
                      <dt className="text-[11px] font-light text-[#777]">
                        Category
                      </dt>
                      <dd className="text-sm font-medium text-[#1f1f1f]">
                        {d.category}
                      </dd>
                    </div>
                  </div>
                </dl>

                <section className="mt-9">
                  <h2 className="text-xl font-normal tracking-tight text-[#1f1f1f]">
                    Overview
                  </h2>
                  <p className="mt-3 max-w-[62ch] whitespace-pre-line text-[14px] font-light leading-[1.75] text-[#444]">
                    {d.description}
                  </p>
                </section>

                <section className="mt-9">
                  <h2 className="text-xl font-normal tracking-tight text-[#1f1f1f]">
                    Highlights
                  </h2>
                  <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                    {highlights.map((h) => (
                      <li
                        key={h}
                        className="flex items-center gap-3 border border-[#ececec] px-4 py-3 text-[13px] font-light text-[#333] transition-colors hover:border-[#bfe6f2] hover:bg-[#f4fbfd]"
                      >
                        <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-green-50">
                          <Check className="size-3.5 text-green-600" />
                        </span>
                        {h}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              {/* Booking card (client) */}
              <BookingCard
                id={d._id}
                name={d.name}
                country={d.country}
                imageUrl={d.imageUrl}
                duration={d.duration}
                departureDate={d.departureDate}
                price={d.price}
                dateLabel={shortDate}
                perks={PERKS}
              />
            </div>
          </>
        )}
      </div>
    </main>
  );
};

export default DestinationDetailsPage;
