import { Banner } from "@/components/Home/banner";
import { WhyChoose } from "@/components/Home/why-choose";
import { Testimonials } from "@/components/Home/testimonials";
import { CallToAction } from "@/components/Home/cta";
import FeaturedDestinations from "@/components/Home/Featured Destinations";

export default function Home() {
  return (
    <>
      <Banner />
      <FeaturedDestinations />
      <WhyChoose />
      <Testimonials />
      <CallToAction />
    </>
  );
}
