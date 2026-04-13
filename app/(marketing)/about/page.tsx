import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-navy dark:text-foreground">About National Millionaire Network</h1>
      <p className="mt-6 text-lg text-muted-foreground">
        NMN is a disciplined referral ecosystem for founders, advisors, and operators who believe trust scales faster
        than ads. We combine the accountability of weekly chapter meetings with modern tooling—so introductions are
        tracked, celebrated, and repeated.
      </p>
      <ul className="mt-8 space-y-4 text-muted-foreground">
        <li>· City-based chapters with structured agendas and attendance.</li>
        <li>· One primary category per member inside each chapter to reduce conflict.</li>
        <li>· Admin oversight for quality, events, and long-term chapter health.</li>
      </ul>
    </div>
  );
}
