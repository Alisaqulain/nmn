"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Handshake, LineChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45 },
};

const logos = ["Vertex Labs", "Harbor Capital", "Atlas Realty", "Meridian Legal", "Summit Health"];

function Glow({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(46,125,50,0.22),transparent_70%)]",
        className
      )}
    />
  );
}

function LogoMarquee() {
  const items = useMemo(() => [...logos, ...logos], []);
  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-background to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-background to-transparent" />
      <div className="flex w-max animate-[marquee_18s_linear_infinite] gap-10 py-2 opacity-80 [--gap:2.5rem] motion-reduce:animate-none">
        {items.map((name, i) => (
          <div
            key={`${name}-${i}`}
            className="flex items-center gap-2 rounded-full border border-border/60 bg-card/40 px-4 py-2 text-sm text-muted-foreground backdrop-blur"
          >
            <span className="inline-block size-1.5 rounded-full bg-navy/80" />
            <span className="font-medium">{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideFrame({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative h-full w-full overflow-hidden rounded-2xl border border-border/70 bg-card/60 shadow-[0_30px_90px_-55px_rgba(0,0,0,0.55)] backdrop-blur">
      <div className="absolute inset-0 bg-[radial-gradient(80%_60%_at_10%_0%,rgba(163,230,53,0.12),transparent_60%)]" />
      <div className="relative p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">NMN Dashboard</p>
            <p className="mt-1 text-base font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
          </div>
          <div className="hidden items-center gap-1 sm:flex">
            <span className="size-2 rounded-full bg-emerald-500/80" />
            <span className="size-2 rounded-full bg-lime-400/80" />
            <span className="size-2 rounded-full bg-red-400/70" />
          </div>
        </div>
        <div className="mt-5 grid gap-4">{children}</div>
      </div>
    </div>
  );
}

function HeroCarousel() {
  const slides = useMemo(
    () => [
      {
        title: "Referral pipeline",
        subtitle: "Track intros, follow-ups, and closed wins.",
        body: (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { k: "Open", v: "12", tone: "bg-navy/10 text-navy dark:text-gold dark:bg-gold/10" },
                { k: "In follow-up", v: "7", tone: "bg-muted text-foreground" },
                { k: "Closed", v: "4", tone: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
              ].map((s) => (
                <div key={s.k} className={cn("rounded-xl border border-border/60 px-3 py-3", s.tone)}>
                  <p className="text-[11px] font-semibold uppercase tracking-wider opacity-80">{s.k}</p>
                  <p className="mt-1 text-2xl font-semibold">{s.v}</p>
                </div>
              ))}
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { t: "Patel Manufacturing expansion", s: "Open · Mumbai Central", p: "High intent · Needs 3 options" },
                { t: "Enterprise payroll vendor", s: "Follow-up · Delhi NCR", p: "Intro requested · Next Tue" },
              ].map((r) => (
                <div key={r.t} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <p className="text-sm font-semibold">{r.t}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{r.s}</p>
                  <p className="mt-2 text-xs text-foreground/80">{r.p}</p>
                </div>
              ))}
            </div>
          </>
        ),
      },
      {
        title: "Chapter operations",
        subtitle: "Meetings, attendance, and member seats.",
        body: (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Next meeting</p>
                <p className="mt-2 text-sm font-semibold">Weekly Chapter Meeting</p>
                <p className="mt-1 text-xs text-muted-foreground">Tue · 7:00 AM</p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full w-[72%] rounded-full bg-navy" />
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Attendance confirmations: 72%</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/40 p-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category seats</p>
                <div className="mt-3 space-y-2">
                  {[
                    { c: "Financial Advisor", v: 100 },
                    { c: "Real Estate", v: 100 },
                    { c: "Attorney", v: 100 },
                    { c: "Branding", v: 40 },
                  ].map((x) => (
                    <div key={x.c}>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-foreground/80">{x.c}</span>
                        <span className="text-muted-foreground">{x.v}%</span>
                      </div>
                      <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className={cn("h-full rounded-full", x.v === 100 ? "bg-emerald-500" : "bg-navy")} style={{ width: `${x.v}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Admin quick actions</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {["Create event", "Post announcement", "Approve member", "Export referrals"].map((t) => (
                  <span key={t} className="rounded-full border border-border/60 bg-card/50 px-3 py-1 text-xs text-foreground/80">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </>
        ),
      },
      {
        title: "Member profiles",
        subtitle: "Build credibility and get found fast.",
        body: (
          <>
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                { n: "Riya Mehta", b: "Mehta Wealth Partners", t: "Financial Advisor", l: "Mumbai" },
                { n: "Vikram Singh", b: "Singh Realty Group", t: "Real Estate", l: "Mumbai" },
              ].map((p) => (
                <div key={p.n} className="rounded-xl border border-border/60 bg-background/40 p-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-10 place-items-center rounded-full bg-navy/10 text-sm font-semibold text-navy">
                      {p.n
                        .split(" ")
                        .slice(0, 2)
                        .map((x) => x[0])
                        .join("")}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.n}</p>
                      <p className="truncate text-xs text-muted-foreground">{p.b}</p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">{p.t}</span>
                    <span className="rounded-full bg-muted px-2 py-1 text-[11px] text-muted-foreground">{p.l}</span>
                    <span className="rounded-full bg-navy/10 px-2 py-1 text-[11px] font-medium text-navy">Verified</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="rounded-xl border border-border/60 bg-background/40 p-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Trust signals</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Testimonials", v: "18" },
                  { k: "Introductions", v: "42" },
                  { k: "Response time", v: "< 2h" },
                ].map((x) => (
                  <div key={x.k} className="rounded-lg border border-border/60 bg-card/40 px-3 py-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{x.k}</p>
                    <p className="mt-1 text-lg font-semibold">{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        ),
      },
    ],
    []
  );

  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((v) => (v + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, [slides.length]);

  const slide = slides[idx];

  return (
    <div className="relative">
      <motion.div
        key={idx}
        initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
        transition={{ duration: 0.45 }}
        className="h-[420px] sm:h-[460px]"
      >
        <SlideFrame title={slide.title} subtitle={slide.subtitle}>
          {slide.body}
        </SlideFrame>
      </motion.div>
      <div className="mt-4 flex items-center justify-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={cn(
              "h-2 rounded-full transition-all",
              i === idx ? "w-8 bg-navy" : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/45"
            )}
          />
        ))}
      </div>
    </div>
  );
}

export function HomePage() {
  const [testimonials, setTestimonials] = useState<
    { id: string; content: string; from?: { name?: string; businessName?: string } | null }[]
  >([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((d) => setTestimonials(d.testimonials?.slice(0, 4) ?? []))
      .catch(() => setTestimonials([]));
  }, []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border/60 bg-gradient-to-b from-background via-background to-muted/40">
        <Glow />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(46,125,50,0.06),transparent_22%,transparent_78%,rgba(46,125,50,0.06))]" />
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="grid items-center gap-10 md:grid-cols-[1.05fr_0.95fr]"
          >
            <div className="text-center md:text-left">
              <div className="mb-6 flex justify-center md:justify-start">
                <Image
                  src="/assets/logo.jpeg"
                  alt="National Millionaire Network"
                  width={520}
                  height={160}
                  className="h-14 w-auto sm:h-16 md:h-18"
                  priority
                />
              </div>
              <div className="flex flex-wrap justify-center gap-2 md:justify-start">
                <Badge variant="secondary" className="border-navy/20 bg-navy/5 text-navy dark:bg-gold/10 dark:text-gold">
                  Premium referral chapters
                </Badge>
                <Badge variant="secondary" className="border-border/60 bg-card/50 text-foreground">
                  One seat per category
                </Badge>
                <Badge variant="secondary" className="border-border/60 bg-card/50 text-foreground">
                  Weekly accountability
                </Badge>
              </div>
              <h1 className="mt-6 text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                A premium network where introductions turn into revenue—predictably.
              </h1>
              <p className="mt-5 text-pretty text-lg text-muted-foreground sm:text-xl">
                NMN gives you the structure of elite chapters with the clarity of a modern dashboard: referrals,
                meetings, events, and trust signals—without the chaos.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:justify-start">
                <Link
                  href="/signup"
                  className={cn(buttonVariants({ size: "lg" }), "gap-2 bg-navy px-6 text-white hover:bg-navy/90")}
                >
                  Apply for membership
                  <ArrowRight className="size-4" />
                </Link>
                <Link href="/how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}>
                  See how it works
                </Link>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  { k: "Avg. time-to-intro", v: "48h" },
                  { k: "Category exclusivity", v: "1 seat" },
                  { k: "Meeting rhythm", v: "Weekly" },
                ].map((x) => (
                  <div key={x.k} className="rounded-xl border border-border/60 bg-card/40 px-4 py-3 backdrop-blur">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{x.k}</p>
                    <p className="mt-1 text-lg font-semibold">{x.v}</p>
                  </div>
                ))}
              </div>
            </div>
            <HeroCarousel />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.p {...fade} className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by entrepreneurs
          </motion.p>
          <motion.div {...fade} className="mt-8">
            <LogoMarquee />
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-3">
            {[
              { k: "Cities", v: "25+", d: "Chapter markets supported" },
              { k: "Categories", v: "1-seat", d: "Exclusivity per chapter category" },
              { k: "Cadence", v: "Weekly", d: "Meetings that keep momentum" },
            ].map((s, i) => (
              <motion.div key={s.k} {...fade} transition={{ ...fade.transition, delay: i * 0.05 }}>
                <Card className="h-full border-border/80">
                  <CardContent className="pt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{s.k}</p>
                    <p className="mt-2 text-3xl font-semibold text-navy dark:text-foreground">{s.v}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{s.d}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl dark:text-foreground">
              How it works
            </h2>
            <p className="mt-3 text-muted-foreground">Three steps. No noise—just structured growth.</p>
          </motion.div>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Join a chapter",
                desc: "One seat per category keeps conflict low and trust high inside each city chapter.",
                icon: Building2,
              },
              {
                step: "02",
                title: "Build visibility",
                desc: "Weekly meetings, clear asks, and tracked introductions—like a boardroom for referrals.",
                icon: Users,
              },
              {
                step: "03",
                title: "Exchange referrals",
                desc: "Give and receive qualified leads with full history on your member dashboard.",
                icon: Handshake,
              },
            ].map((item, i) => (
              <motion.div key={item.step} {...fade} transition={{ ...fade.transition, delay: i * 0.08 }}>
                <Card className="h-full border-border/80 shadow-sm">
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold">
                      <item.icon className="size-5" />
                    </div>
                    <p className="text-xs font-semibold text-gold">{item.step}</p>
                    <CardTitle className="text-lg">{item.title}</CardTitle>
                    <CardDescription className="text-base leading-relaxed">{item.desc}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-border/60 bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl dark:text-foreground">
              Built for performance
            </h2>
            <p className="mt-3 text-muted-foreground">Premium experience inspired by Stripe clarity and LinkedIn polish.</p>
          </motion.div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { title: "Role-based access", desc: "Admins orchestrate chapters; members focus on referrals.", icon: ShieldCheck },
              { title: "Referral intelligence", desc: "Dashboards for given vs received with status tracking.", icon: LineChart },
              { title: "Events & training", desc: "Workshops and intensives with simple registration flows.", icon: Sparkles },
            ].map((b, i) => (
              <motion.div key={b.title} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }}>
                <Card className="h-full">
                  <CardContent className="flex gap-4 pt-6">
                    <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-navy/10 text-navy">
                      <b.icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{b.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border/60 py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl dark:text-foreground">FAQ</h2>
            <p className="mt-3 text-muted-foreground">The questions people ask before joining.</p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {[
              {
                q: "What does “one seat per category” mean?",
                a: "Each chapter has one member per business category to avoid internal competition and improve trust.",
              },
              {
                q: "Do I need Premium to join a chapter?",
                a: "Yes—Premium unlocks chapter placement and referral flows. Free is for orientation and browsing.",
              },
              {
                q: "How are referrals tracked?",
                a: "Members log referrals with statuses so you can see what’s open, closed, and pending follow-up.",
              },
              {
                q: "Is this like BNI?",
                a: "Similar discipline, but designed with modern UX and member dashboards for transparency and follow-through.",
              },
            ].map((f, i) => (
              <motion.div key={f.q} {...fade} transition={{ ...fade.transition, delay: i * 0.05 }}>
                <Card className="h-full border-border/80">
                  <CardHeader>
                    <CardTitle className="text-base">{f.q}</CardTitle>
                    <CardDescription className="text-sm leading-relaxed">{f.a}</CardDescription>
                  </CardHeader>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl dark:text-foreground">
              What members say
            </h2>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(testimonials.length ? testimonials : [{ id: "1", content: "Join a chapter and seed testimonials from the dashboard—this space fills from live member stories.", from: { name: "NMN", businessName: "Platform" } }]).map(
              (t, i) => (
                <motion.div key={t.id} {...fade} transition={{ ...fade.transition, delay: i * 0.06 }}>
                  <Card className="h-full border-border/80">
                    <CardContent className="pt-6">
                      <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.content}&rdquo;</p>
                      <p className="mt-4 text-xs font-medium text-muted-foreground">
                        — {t.from?.name ?? "Member"}
                        {t.from?.businessName ? ` · ${t.from.businessName}` : ""}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      <section className="border-t border-border/60 bg-navy py-20 text-primary-foreground">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div {...fade} className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">Membership plans</h2>
            <p className="mt-3 text-sm text-white/70">Start free, upgrade when you are ready to run referrals at full speed.</p>
          </motion.div>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            <motion.div {...fade}>
              <Card className="border-white/10 bg-white/5 text-white backdrop-blur">
                <CardHeader>
                  <CardTitle>Free</CardTitle>
                  <CardDescription className="text-white/65">Orientation access</CardDescription>
                  <p className="pt-2 text-3xl font-semibold">
                    $0<span className="text-base font-normal text-white/60">/mo</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-white/75">
                  <p>· Public directory preview</p>
                  <p>· Limited event visibility</p>
                  <p>· Profile basics</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div {...fade} transition={{ ...fade.transition, delay: 0.06 }}>
              <Card className="border-gold/40 bg-white text-navy shadow-xl">
                <CardHeader>
                  <Badge className="w-fit bg-gold text-navy hover:bg-gold">Most popular</Badge>
                  <CardTitle className="text-navy">Premium</CardTitle>
                  <CardDescription>Full chapter + referral stack</CardDescription>
                  <p className="pt-2 text-3xl font-semibold text-navy">
                    $499<span className="text-base font-normal text-navy/60">/yr</span>
                  </p>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-navy/80">
                  <p>· Join a city chapter (category exclusivity)</p>
                  <p>· Give & receive referrals</p>
                  <p>· Meetings, attendance, and events</p>
                </CardContent>
                <div className="px-6 pb-6">
                  <Link href="/signup" className={cn(buttonVariants(), "w-full bg-navy text-white hover:bg-navy/90")}>
                    Go premium
                  </Link>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <motion.div {...fade}>
            <h2 className="text-3xl font-semibold tracking-tight text-navy sm:text-4xl dark:text-foreground">
              Ready for introductions that close?
            </h2>
            <p className="mt-4 text-muted-foreground">
              Apply today. Our team helps you find the right chapter and category fit.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <Link href="/contact" className={cn(buttonVariants({ size: "lg" }), "bg-gold text-navy hover:bg-gold/90")}>
                Talk to us
              </Link>
              <Link href="/chapters" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
                Browse chapters
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
