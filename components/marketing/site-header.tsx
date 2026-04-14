"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { buttonVariants } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/membership", label: "Membership" },
  { href: "/chapters", label: "Chapters" },
  { href: "/contact", label: "Contact" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => setAuthed(!!d.user))
      .catch(() => setAuthed(false));
  }, [pathname]);

  const NavLinks = ({ mobile }: { mobile?: boolean }) => (
    <nav className={cn("flex gap-6 text-sm font-medium", mobile && "flex-col gap-4")}>
      {nav.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-foreground/80 transition hover:text-foreground",
            pathname === item.href && "text-gold"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-6xl items-center justify-between px-4 py-2 sm:px-6">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/assets/logo.jpeg"
            alt="National Millionaire Network"
            width={240}
            height={72}
            className="h-12 w-auto sm:h-14"
            priority
          />
        </Link>
        <div className="hidden items-center gap-8 md:flex">
          <NavLinks />
        </div>
        <div className="flex items-center gap-2">
          {mounted && (
            <div className="hidden items-center gap-2 sm:flex">
              <Sun className="size-4 text-muted-foreground" />
              <Switch
                checked={theme === "dark"}
                onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
                aria-label="Toggle dark mode"
              />
              <Moon className="size-4 text-muted-foreground" />
            </div>
          )}
          {authed ? (
            <Link
              href="/dashboard"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "hidden sm:inline-flex")}>
                Log in
              </Link>
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-navy text-white hover:bg-navy/90 dark:text-white"
                )}
              >
                Join NMN
              </Link>
            </>
          )}
          <Sheet>
            <SheetTrigger
              className={cn(buttonVariants({ variant: "outline", size: "icon" }), "md:hidden")}
              aria-label="Open menu"
            >
              <Menu className="size-4" />
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col gap-6">
              <NavLinks mobile />
              {mounted && (
                <div className="flex items-center justify-between rounded-lg border p-3">
                  <span className="text-sm">Dark mode</span>
                  <Switch
                    checked={theme === "dark"}
                    onCheckedChange={(c) => setTheme(c ? "dark" : "light")}
                  />
                </div>
              )}
              {!authed && (
                <div className="flex flex-col gap-2">
                  <Link href="/login" className={cn(buttonVariants())}>
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className={cn(buttonVariants(), "bg-navy text-white hover:bg-navy/90")}
                  >
                    Join NMN
                  </Link>
                </div>
              )}
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
