import FeaturedCarousel, {
  type FeaturedDestination,
} from "../Home/Featured carousel";

const FeaturedDestinations = async () => {
  let destinations: FeaturedDestination[] = [];

  try {
    const res = await fetch("http://localhost:8000/destinations", {
      next: { revalidate: 60 },
    });
    if (res.ok) destinations = await res.json();
  } catch {
    // The home page should never break because the API is down.
  }

  if (destinations.length === 0) return null;

  return (
    <section className="w-full overflow-x-clip bg-white px-4 py-14 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <FeaturedCarousel destinations={destinations.slice(0, 6)} />
      </div>
    </section>
  );
};

export default FeaturedDestinations;
