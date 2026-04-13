import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/membership", label: "Membership" },
  { href: "/chapters", label: "Chapters" },
  { href: "/contact", label: "Contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-border/60 bg-navy text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 md:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <Image
              src="/assets/logo.jpeg"
              alt="National Millionaire Network"
              width={180}
              height={50}
              className="mb-4 h-10 w-auto brightness-0 invert"
            />
            <p className="max-w-sm text-sm text-white/75">
              A premium referral networking platform for entrepreneurs who treat introductions like currency.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Explore</p>
            <ul className="space-y-2 text-sm text-white/80">
              {links.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-white">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-gold">Members</p>
            <ul className="space-y-2 text-sm text-white/80">
              <li>
                <Link href="/login" className="hover:text-white">
                  Log in
                </Link>
              </li>
              <li>
                <Link href="/signup" className="hover:text-white">
                  Create account
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col gap-2 border-t border-white/10 pt-8 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} National Millionaire Network. All rights reserved.</span>
          <span className="text-white/45">BNI-style chapters · Trusted referrals · Member-first</span>
        </div>
      </div>
    </footer>
  );
}
