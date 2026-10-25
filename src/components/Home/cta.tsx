import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CallToAction() {
  return (
    <section className="relative px-4 py-28 text-center text-white lg:py-36">
      <Image
        src="/images/CTA.png"
        alt="Aerial view of a plane flying over a tropical island"
        fill
        sizes="100vw"
        className="-z-10 object-cover"
      />
      {/* Heavy darkening keeps white text readable over the bright water */}
      <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden />

      <h2 className="mx-auto max-w-3xl text-4xl font-medium tracking-tight text-balance sm:text-5xl lg:text-6xl">
        Ready To Start Your Journey?
      </h2>
      <p className="mt-4 text-base text-white/85">
        Join thousands of travelers who have discovered the world with us
      </p>
      <Button
        variant="secondary"
        className="mt-12 h-12 rounded-md px-8 text-sm font-semibold tracking-wider uppercase text-foreground hover:bg-white"
      >
        Book Your Trip Today
        <ArrowRight data-icon="inline-end" className="size-4" />
      </Button>
    </section>
  );
}
