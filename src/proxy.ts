import { NextResponse, type NextRequest } from "next/server";

import { auth } from "@/lib/auth";

export async function proxy(request: NextRequest) {
  // Inside the proxy, read the cookies from the incoming request itself.
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/add-destination",
    "/bookings",
    // Destination details (/destinations/123) only. The list page (/destinations) stays public.
    "/destinations/:path+",
  ],
};
