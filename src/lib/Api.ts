import { headers } from "next/headers";

import { auth } from "@/lib/auth";

// Server-only helper. Never import this from a "use client" component.

export const API_URL =
  process.env.API_URL ?? `${process.env.NEXT_PUBLIC_API_URL}`;

// Asks better-auth for a short-lived JWT of the logged-in user.
// Returns null when nobody is logged in.
export async function getAuthHeaders(): Promise<Record<string, string> | null> {
  try {
    const result = await auth.api.getToken({ headers: await headers() });
    if (!result?.token) return null;
    return { authorization: `Bearer ${result.token}` };
  } catch {
    return null;
  }
}
