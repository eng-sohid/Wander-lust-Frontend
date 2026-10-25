import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Input } from "@/components/ui/input";

const linkColumns = [
  {
    heading: "Quick Links",
    links: [
      { label: "Home", href: "/" },
      { label: "Destinations", href: "/destinations" },
      { label: "My Bookings", href: "/bookings" },
      { label: "My Profile", href: "/profile" },
    ],
  },
  {
    heading: "Support",
    links: [
      { label: "Help Center", href: "/help" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

// Lucide ships no brand/social glyphs in this version, so they are inlined here.
const socials = [
  {
    label: "X",
    href: "https://x.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com",
    svg: (
      <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "https://instagram.com",
    svg: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden
        className="size-4"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
      </svg>
    ),
  },
];

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-20">
        <p className="text-6xl font-extrabold tracking-tight md:text-7xl lg:text-8xl">
          Wanderlast
        </p>
        <p className="mt-4 text-sm text-white/80">
          Your gateway to extraordinary travel experiences around the world.
        </p>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Newsletter */}
          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase">
              Newsletter
            </h3>
            <p className="mt-2 text-xs text-white/60">
              Subscribe for exclusive travel deals and inspiration.
            </p>
            <form className="relative mt-5 max-w-64" action="/newsletter">
              <Input
                type="email"
                name="email"
                placeholder="Enter email"
                className="h-11 rounded-md border-none bg-[#2e2e2e] pr-10 text-white placeholder:text-white/60"
              />
              <button
                type="submit"
                aria-label="Subscribe to newsletter"
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-white/80 transition-colors hover:text-white"
              >
                <ArrowUpRight className="size-4" />
              </button>
            </form>
          </div>

          {/* Link columns */}
          {linkColumns.map((column) => (
            <div key={column.heading}>
              <h3 className="text-sm font-medium tracking-wide uppercase">
                {column.heading}
              </h3>
              <ul className="mt-5 space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/75 transition-colors hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div>
            <h3 className="text-sm font-medium tracking-wide uppercase">
              Contact Us
            </h3>
            <ul className="mt-5 space-y-3 text-sm text-white/75">
              <li>
                <a
                  href="tel:+17869011622"
                  className="transition-colors hover:text-white"
                >
                  786 901 1622
                </a>
              </li>
              <li>
                <a
                  href="mailto:info@wandartland.com"
                  className="transition-colors hover:text-white"
                >
                  info@wandartland.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6">
          <p className="text-xs text-white/60">
            © 2026 Wanderlust. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                target="_blank"
                rel="noreferrer"
                className="text-white/90 transition-colors hover:text-white"
              >
                {social.svg}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
