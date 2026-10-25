import DestinationsExplorer, {
  type Destination,
} from "../../components/Destinations/Destinations explorer ";

const AllDestinationsPage = async () => {
  let destinations: Destination[] = [];
  let error: string | null = null;

  try {
    const res = await fetch("http://localhost:8000/destinations", {
      next: { revalidate: 60 },
    });
    if (!res.ok) throw new Error("Failed to fetch destinations");
    destinations = await res.json();
  } catch (err) {
    error = err instanceof Error ? err.message : "Unknown error";
  }

  return (
    <main className="min-h-screen bg-white px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-3 border-b border-[#ececec] pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-[clamp(2.2rem,4vw,3.25rem)] font-light leading-[1.05] tracking-[-0.04em] text-[#1f1f1f]">
              Explore All Destinations
            </h1>
            <p className="mt-3 max-w-md text-sm text-[#555]">
              Find your perfect travel experience from our curated collection
            </p>
          </div>
          {!error && (
            <p className="text-sm text-[#555]">
              <span className="text-3xl font-light tracking-tight text-[#1aa6cf]">
                {destinations.length}
              </span>{" "}
              packages available
            </p>
          )}
        </div>

        {error && (
          <div className="mt-8 rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
            <p>Error loading destinations: {error}</p>
          </div>
        )}

        {!error && <DestinationsExplorer destinations={destinations} />}
      </div>
    </main>
  );
};

export default AllDestinationsPage;
