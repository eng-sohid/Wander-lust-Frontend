"use server";

import { revalidatePath } from "next/cache";

import { API_URL, getAuthHeaders } from "../lib/Api";

const NOT_LOGGED_IN = {
  ok: false as const,
  error: "You need to be logged in.",
};

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
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) return NOT_LOGGED_IN;

  try {
    const res = await fetch(`${API_URL}/destination/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify(data),
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false as const,
        error:
          res.status === 404
            ? "You can only edit destinations that you added."
            : "Failed to update destination",
      };
    }
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  revalidatePath(`/destinations/${id}`);
  revalidatePath("/destinations");
  return { ok: true as const };
}

export async function deleteDestination(id: string) {
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) return NOT_LOGGED_IN;

  try {
    const res = await fetch(`${API_URL}/destination/${id}`, {
      method: "DELETE",
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok) {
      return {
        ok: false as const,
        error:
          res.status === 404
            ? "You can only delete destinations that you added."
            : "Failed to delete destination",
      };
    }
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  revalidatePath("/destinations");
  return { ok: true as const };
}

export type BookingInput = {
  userId: string;
  userName: string;
  userEmail: string;
  userImage?: string | null;
  destinationId: string;
  destinationName: string;
  country: string;
  imageUrl: string;
  duration: string;
  departureDate: string;
  pricePerPerson: number;
  travelers: number;
  totalPrice: number;
};

export async function createBooking(data: BookingInput) {
  const authHeaders = await getAuthHeaders();
  if (!authHeaders) return NOT_LOGGED_IN;

  try {
    // Only the destination id and traveler count come from the browser.
    // The backend reads the user from the JWT and the price from the database.
    const res = await fetch(`${API_URL}/booking`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders },
      body: JSON.stringify({
        destinationId: data.destinationId,
        travelers: data.travelers,
      }),
      cache: "no-store",
    });
    if (!res.ok)
      return { ok: false as const, error: "Failed to create booking" };
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  revalidatePath("/bookings");
  return { ok: true as const };
}
