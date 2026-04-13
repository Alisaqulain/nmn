"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Building2, Handshake, LineChart, ShieldCheck, Sparkles, Users } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const fade = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.45 },
};

const logos = ["Vertex Labs", "Harbor Capital", "Atlas Realty", "Meridian Legal", "Summit Health"];

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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(212,175,55,0.12),transparent)]" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <Badge variant="secondary" className="mb-4 border-gold/30 bg-gold/10 text-navy dark:text-gold">
              National Millionaire Network
            </Badge>
            <h1 className="text-balance text-4xl font-semibold tracking-tight text-navy sm:text-5xl md:text-6xl dark:text-foreground">
              Referrals that compound like capital.
            </h1>
            <p className="mt-5 text-pretty text-lg text-muted-foreground sm:text-xl">
              City-based chapters, one member per category, and a disciplined weekly rhythm—built for operators who
              want LinkedIn polish with BNI-level accountability.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/signup"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "gap-2 bg-navy px-6 text-white hover:bg-navy/90 dark:text-white"
                )}
              >
                Apply for membership
                <ArrowRight className="size-4" />
              </Link>
              <Link href="/how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "px-6")}>
                See how it works
              </Link>
            </div>
            <p className="mt-6 text-sm text-muted-foreground">
              Premium unlocks referrals, chapter placement, and full event access.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-b border-border/60 py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.p {...fade} className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by entrepreneurs
          </motion.p>
          <motion.div
            {...fade}
            className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-80"
          >
            {logos.map((name) => (
              <span key={name} className="text-sm font-medium text-muted-foreground">
                {name}
              </span>
            ))}
          </motion.div>
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
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-navy/5 text-navy dark:bg-gold/10 dark:text-gold">
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
                    <b.icon className="mt-0.5 size-5 shrink-0 text-gold" />
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
