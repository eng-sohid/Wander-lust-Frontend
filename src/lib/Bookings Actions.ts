"use server";

import { revalidatePath } from "next/cache";

import { API_URL, getAuthHeaders } from "../lib/Api";

export async function cancelBooking(id: string) {
  const authHeaders = await getAuthHeaders();
  if (!authHeaders)
    return { ok: false as const, error: "You need to be logged in." };

  try {
    const res = await fetch(`${API_URL}/booking/${id}`, {
      method: "DELETE",
      headers: authHeaders,
      cache: "no-store",
    });
    if (!res.ok)
      return { ok: false as const, error: "Failed to cancel booking" };
  } catch {
    return { ok: false as const, error: "Could not reach the server" };
  }

  revalidatePath("/bookings");
  return { ok: true as const };
}
