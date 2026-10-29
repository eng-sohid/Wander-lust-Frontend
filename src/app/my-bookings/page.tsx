import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  CircleCheck,
  Clock,
  Eye,
  MapPin,
  PackagePlus,
  Plane,
} from "lucide-react";

import { auth } from "@/lib/auth";
import CancelBookingButton from "../../components/Destinations/Cancel booking button";
import { getAuthHeaders } from "../../lib/Api";

type Booking = {
  _id: string;
  userEmail: string;
  destinationId: string;
  destinationName: string;
  imageUrl: string;
  departureDate: string;
  travelers?: number;
  totalPrice: number;
  status?: "confirmed" | "pending" | string;
};

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

function StatusBadge({ status }: { status?: string }) {
  const confirmed = status === "confirmed";
  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${
        confirmed ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-600"
      }`}
    >
      {confirmed ? (
        <CircleCheck className="size-3.5" />
      ) : (
        <Clock className="size-3.5" />
      )}
      {confirmed ? "Confirmed" : "Pending"}
    </span>
  );
}

const MyBookingsPage = async () => {
  const session = await auth.api.getSession({ headers: await headers() });
  const user = session?.user;
  if (!user) redirect("/login");
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) redirect("/login");

  let bookings: Booking[] = [];
  let error: string | null = null;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/my-bookings/${encodeURIComponent(user.email)}`,
      { cache: "no-store", headers: authHeaders },
    );
    if (!res.ok) throw new Error("Failed to fetch bookings");
    bookings = await res.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <main className="min-h-screen bg-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-[clamp(2rem,4vw,2.75rem)] font-light leading-tight tracking-[-0.03em] text-[#1f1f1f]">
          My Bookings
        </h1>
        <p className="mt-1.5 text-xs font-light text-[#444]">
          Manage and view your upcoming travel plans
        </p>

        {error && (
          <div className="mt-8 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>Error loading bookings: {error}</p>
          </div>
        )}

        {!error && bookings.length === 0 && (
          <div className="mt-8 flex flex-col items-center border border-dashed border-[#d9d9d9] px-6 py-20 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-[#e8f6fb]">
              <Plane className="size-6 text-[#1aa6cf]" />
            </div>
            <h2 className="text-lg font-medium text-[#1f1f1f]">
              No bookings yet
            </h2>
            <p className="mt-1 max-w-sm text-sm text-[#666]">
              When you book a trip, it will show up here.
            </p>
            <Link
              href="/destinations"
              className="mt-6 inline-flex h-10 items-center gap-2 bg-[#17a2c4] px-4 text-sm font-medium text-white hover:bg-[#1499c5]"
            >
              Explore Destinations
            </Link>
          </div>
        )}

        {bookings.length > 0 && (
          <ul className="mt-6 space-y-4">
            {bookings.map((b) => (
              <li
                key={b._id}
                className="flex flex-col gap-4 border border-[#ececec] bg-white p-2.5 shadow-[0_1px_4px_rgba(0,0,0,0.04)] sm:flex-row"
              >
                <div className="relative aspect-[1.8/1] w-full shrink-0 overflow-hidden bg-muted sm:w-[270px]">
                  {b.imageUrl ? (
                    <Image
                      src={b.imageUrl}
                      alt={b.destinationName}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 270px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <PackagePlus className="size-8 text-muted-foreground/50" />
                    </div>
                  )}
                </div>

                <div className="flex min-w-0 flex-1 flex-col justify-between gap-3 sm:py-0.5">
                  <div className="space-y-1.5">
                    <StatusBadge status={b.status} />
                    <h2 className="truncate text-2xl font-normal tracking-tight text-[#1f1f1f]">
                      {b.destinationName}
                    </h2>
                    <p className="flex items-center gap-2 text-[11px] font-light text-[#555]">
                      <CalendarDays className="size-3.5" />
                      Departure: {formatDate(b.departureDate)}
                    </p>
                    <p className="flex items-center gap-2 text-[11px] font-light text-[#555]">
                      <MapPin className="size-3.5" />
                      Booking ID: BK-{b._id.slice(-6).toUpperCase()}
                    </p>
                  </div>

                  <div className="flex items-end justify-between gap-3">
                    <p className="text-2xl font-medium tracking-tight text-[#1aa6cf]">
                      ${b.totalPrice.toLocaleString("en-US")}
                      {b.travelers && b.travelers > 1 && (
                        <span className="ml-2 text-[11px] font-light text-[#777]">
                          {b.travelers} travelers
                        </span>
                      )}
                    </p>
                    <div className="flex items-center gap-2">
                      <CancelBookingButton
                        id={b._id}
                        name={b.destinationName}
                      />
                      <Link
                        href={`/destinations/${b.destinationId}`}
                        className="inline-flex h-8 items-center gap-1.5 bg-[#17a2c4] px-4 text-[11px] font-medium text-white transition-colors hover:bg-[#1499c5]"
                      >
                        <Eye className="size-3.5" />
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
};

export default MyBookingsPage;
