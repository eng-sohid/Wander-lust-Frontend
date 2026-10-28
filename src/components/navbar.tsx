"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, Menu, UserRound, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { authClient } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Destinations", href: "/destinations" },
  { label: "Add Destination", href: "/add-destination" },
  { label: "My Bookings", href: "/my-bookings" },
];

const linkClasses =
  "relative flex h-full items-center text-sm font-medium text-foreground transition-colors hover:text-brand data-active:text-brand";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const user = session?.user;

  const [menuOpen, setMenuOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const handleSignOut = async () => {
    setSigningOut(true);
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          setPopoverOpen(false);
          setMenuOpen(false);
          router.push("/");
          router.refresh();
        },
      },
    });
    setSigningOut(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-background">
      {/* The brand is absolutely centered so it stays centered
          regardless of the left/right content widths. */}
      <div className="relative mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Left: desktop links / mobile menu button */}
        <nav className="hidden items-stretch gap-8 self-stretch md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-active={isActive(link.href) || undefined}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                linkClasses,
                "after:content-[''] data-active:after:absolute data-active:after:inset-x-0 data-active:after:bottom-0 data-active:after:h-0.5 data-active:after:bg-brand",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <button
          type="button"
          onClick={() => setMenuOpen((o) => !o)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          className="flex size-9 items-center justify-center rounded-md hover:bg-muted md:hidden"
        >
          {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Center: brand (always visible) */}
        <Link
          href="/"
          className="absolute left-1/2 -translate-x-1/2 text-2xl font-bold tracking-wide text-brand"
        >
          Wanderlast
        </Link>

        {/* Right: account */}
        <div className="flex items-center gap-5">
          {isPending ? (
            <div className="size-8 animate-pulse rounded-full bg-muted" />
          ) : user ? (
            <>
              <Link
                href="/profile"
                className="hidden items-center gap-1.5 text-sm font-medium text-foreground transition-colors hover:text-brand sm:flex"
              >
                <UserRound className="size-4" />
                Profile
              </Link>

              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      aria-label="Open account menu"
                      className="rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
                    />
                  }
                >
                  <Avatar>
                    <AvatarImage
                      referrerPolicy="no-referrer"
                      src={user.image ?? undefined}
                      alt={user.name}
                    />
                    <AvatarFallback>
                      {user.name?.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-64">
                  <PopoverHeader>
                    <PopoverTitle>{user.name}</PopoverTitle>
                    <PopoverDescription className="truncate">
                      {user.email}
                    </PopoverDescription>
                  </PopoverHeader>
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleSignOut}
                    disabled={signingOut}
                    className="mt-3 w-full gap-2"
                  >
                    <LogOut className="size-4" />
                    {signingOut ? "Signing out..." : "Sign out"}
                  </Button>
                </PopoverContent>
              </Popover>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-foreground transition-colors hover:text-brand"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="text-sm font-medium text-foreground transition-colors hover:text-brand"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="border-t bg-background px-4 py-2 md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              aria-current={isActive(link.href) ? "page" : undefined}
              className={cn(
                "block rounded-md px-2 py-2.5 text-sm font-medium transition-colors hover:bg-muted",
                isActive(link.href) ? "text-brand" : "text-foreground",
              )}
            >
              {link.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="block rounded-md px-2 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              Profile
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
