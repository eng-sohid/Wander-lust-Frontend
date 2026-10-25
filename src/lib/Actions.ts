"use server";

import { revalidatePath } from "next/cache";

export type DestinationUpdate = {
  name: string;
  country: string;
  category: string;
  price: number;
  duration: string;
  departureDate: string;
  imageUrl: string;
  description: string;
};

export async function updateDestination(id: string, data: DestinationUpdate) {
  try {
    const res = await fetch(`http://localhost:8000/destination/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok)
      return { ok: false as const, error: "Failed to update destination" };
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  // Clear the cached data so the details page and the list page
  // show the new values immediately, every time you save.
  revalidatePath(`/destinations/${id}`);
  revalidatePath("/destinations");

  return { ok: true as const };
}

export async function deleteDestination(id: string) {
  try {
    const res = await fetch(`http://localhost:8000/destination/${id}`, {
      method: "DELETE",
      cache: "no-store",
    });
    if (!res.ok)
      return { ok: false as const, error: "Failed to delete destination" };
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  // The list page must stop showing the deleted package.
  revalidatePath("/destinations");

  return { ok: true as const };
}
