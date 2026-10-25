import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const searchFields = [
  { label: "Location", value: "Address, City Or Zip" },
  { label: "Date/Duration", value: "Anytime/3 Days" },
  { label: "Budget", value: "$0 - $3000" },
  { label: "People", value: "5-10" },
];

export function Banner() {
  return (
    <section className="relative flex min-h-[560px] flex-col text-white lg:min-h-[640px]">
      <Image
        src="/images/Banner.png"
        alt="Coastal village surrounded by forest"
        fill
        preload
        className="-z-10 object-cover"
      />
      {/* Darken the photo slightly so white text stays readable */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />

      <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <h1 className="max-w-3xl text-5xl leading-tight font-medium tracking-tight text-balance sm:text-6xl lg:text-7xl">
          Discover Your Next Adventure
        </h1>
        <p className="mt-6 max-w-xl text-base/relaxed text-white/90">
          Explore breathtaking destinations and create unforgettable memories
          with our curated travel experiences.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button className="h-12 gap-2 rounded-md px-7 text-sm font-semibold tracking-wide uppercase text-white">
            Explore Now
            <ArrowRight data-icon="inline-end" className="size-4" />
          </Button>
          <Button
            variant="secondary"
            className="h-12 rounded-md border border-white/40 bg-white/15 px-7 text-sm font-semibold tracking-wide uppercase text-white backdrop-blur-sm hover:bg-white/25"
          >
            View Destination
          </Button>
        </div>
      </div>

      <div className="relative">
        <div className="grid grid-cols-2 grid-rows-2 divide-x divide-y divide-white/25 bg-black/35 backdrop-blur-md md:grid-cols-5 md:grid-rows-1 md:divide-y-0">
          {searchFields.map((field) => (
            <button
              key={field.label}
              type="button"
              className="group flex flex-col items-start gap-0.5 px-6 py-4 text-left transition-colors hover:bg-white/10"
            >
              <span className="text-sm font-semibold">{field.label}</span>
              <span className="text-xs text-white/70 transition-colors group-hover:text-white/90">
                {field.value}
              </span>
            </button>
          ))}
          <button
            type="button"
            className="col-span-2 bg-brand-bright py-4 text-sm font-semibold tracking-wide text-white transition-colors hover:bg-brand-bright/90 md:col-span-1"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}
