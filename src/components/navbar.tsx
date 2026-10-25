import Link from "next/link";
import { UserRound } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Home", href: "/", active: true },
  { label: "Destinations", href: "/destinations", active: false },
  { label: "Add Destination", href: "/add-destination", active: false },
  { label: "My Bookings", href: "/bookings", active: false },
];

const accountLinks = [
  { label: "Profile", href: "/profile", icon: UserRound },
  { label: "Login", href: "/login" },
  { label: "Sign Up", href: "/signup" },
];

const linkClasses =
  "relative flex h-full items-center text-sm font-medium text-foreground transition-colors hover:text-brand data-active:text-brand";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {/* Three-zone nav: the brand is absolutely centered so it stays visually
          centered regardless of the left/right link widths. */}
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        <nav className="hidden items-stretch gap-8 self-stretch md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-active={link.active || undefined}
              className={cn(
                linkClasses,
                "data-active:after:absolute data-active:after:inset-x-0 data-active:after:bottom-0 data-active:after:h-0.5 data-active:after:bg-brand after:content-['']",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/"
          className="text-2xl font-bold tracking-wide text-brand md:absolute md:left-1/2 md:-translate-x-1/2"
        >
          Wanderlast
        </Link>

        <nav className="flex items-center gap-6">
          {accountLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand"
            >
              {link.icon ? <link.icon className="size-4" /> : null}
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
