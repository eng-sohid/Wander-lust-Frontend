"use client";

import Image from "next/image";
import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

// NOTE: only two traveler portraits ship in /public/images — items 3 and 4
// reuse them as placeholders until real photos are added.
const testimonials = [
  {
    quote:
      "\"The Bali Trip Was Absolutely Magical! Every Detail Was Perfectly Planned. The Resorts Were Luxurious And The Cultural Experiences Were Unforgettable.\"",
    author: "Michael Chen",
    location: "Singapore",
    photo: "person2",
  },
  {
    quote:
      "\"Swiss Alps Adventure Exceeded All Expectations. The Mountain Views Were Breathtaking And Our Guide Was Incredibly Knowledgeable. Highly Recommend!\"",
    author: "Sarah Johnson",
    location: "New York, USA",
    photo: "person1",
  },
  {
    quote:
      "\"Tokyo Was A Dream Come True. Every Neighborhood Felt Like A New World — The Food, The Temples, And The Kindness Of The Locals Made It Unforgettable.\"",
    author: "David Kim",
    location: "Toronto, Canada",
    photo: "person2",
  },
  {
    quote:
      "\"Our Honeymoon In Santorini Was Flawless From Start To Finish. The Private Sunset Cruise And Cliffside Suites Were Beyond Anything We Imagined.\"",
    author: "Emily Rodriguez",
    location: "Barcelona, Spain",
    photo: "person1",
  },
];

export function Testimonials() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({
      left: direction * (track.clientWidth * 0.55),
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#f8f9fa] py-16 lg:py-24">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl font-medium tracking-tight lg:text-5xl">
              What Travelers Say
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Real experiences from our happy travelers
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              aria-label="Previous testimonials"
              onClick={() => scrollByCard(-1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ArrowLeft className="size-5" />
            </button>
            <button
              type="button"
              aria-label="Next testimonials"
              onClick={() => scrollByCard(1)}
              className="flex size-11 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand hover:text-brand"
            >
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>

        <div
          ref={trackRef}
          className="mt-10 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {testimonials.map((item) => (
            <figure
              key={item.author}
              className="flex w-[85%] shrink-0 snap-start border border-border bg-background md:w-[calc(50%-1rem)]"
            >
              <div className="flex flex-1 flex-col p-6">
                <blockquote className="text-xl leading-snug font-medium">
                  {item.quote}
                </blockquote>
                <figcaption className="mt-auto pt-6">
                  <span className="text-sm font-medium text-brand">
                    — {item.author}
                  </span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.location}
                  </p>
                </figcaption>
              </div>
              <div className="relative w-[42%] self-stretch">
                <Image
                  src={`/images/${item.photo}.png`}
                  alt={`Portrait of ${item.author}`}
                  fill
                  sizes="(max-width: 768px) 40vw, 20vw"
                  className="object-cover"
                />
              </div>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
