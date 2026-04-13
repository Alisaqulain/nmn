"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useUser } from "@/hooks/use-user";
import { toast } from "sonner";
import { ArrowRight, Sparkles } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function DashboardHomePage() {
  const { user, loading: userLoading, refresh } = useUser();
  const [stats, setStats] = useState<{ given: number; received: number } | null>(null);
  const [meetings, setMeetings] = useState<{ id: string; title: string; startsAt: string }[]>([]);
  const [chapters, setChapters] = useState<{ id: string; name: string; city: string }[]>([]);
  const [joinId, setJoinId] = useState("");
  const [joinCat, setJoinCat] = useState("");

  useEffect(() => {
    if (!user || user.plan !== "premium") {
      setStats(null);
      return;
    }
    fetch("/api/referrals")
      .then((r) => r.json())
      .then((d) => {
        if (d.stats) setStats(d.stats);
      })
      .catch(() => setStats(null));
  }, [user]);

  useEffect(() => {
    if (!user || user.plan !== "premium") return;
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []))
      .catch(() => setChapters([]));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/meetings")
      .then((r) => r.json())
      .then((d) => setMeetings((d.meetings ?? []).slice(0, 3)))
      .catch(() => setMeetings([]));
  }, [user]);

  async function joinChapter(e: React.FormEvent) {
    e.preventDefault();
    if (!joinId || !joinCat.trim()) {
      toast.error("Chapter and category required");
      return;
    }
    const r = await fetch(`/api/chapters/${joinId}/join`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category: joinCat.trim() }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Could not join");
      return;
    }
    toast.success("Joined chapter");
    refresh();
    setJoinCat("");
  }

  async function mockPay() {
    const r = await fetch("/api/billing/mock-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan: "premium" }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Checkout failed");
      return;
    }
    toast.success("Premium activated (mock payment)");
    refresh();
  }

  if (userLoading || !user) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-1/3" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div>
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-semibold tracking-tight text-navy dark:text-foreground"
        >
          Welcome back, {user.name?.split(" ")[0] || "member"}
        </motion.h1>
        <p className="mt-2 text-muted-foreground">Your chapter pulse, referrals, and meetings in one place.</p>
      </div>

      {user.plan === "free" && (
        <Card className="border-gold/40 bg-gradient-to-r from-navy/5 to-gold/10">
          <CardHeader className="flex flex-row items-center justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Sparkles className="size-5 text-gold" />
                Unlock premium
              </CardTitle>
              <CardDescription>Chapters, referrals, and full meeting tools.</CardDescription>
            </div>
            <Button type="button" onClick={mockPay} className="shrink-0 bg-gold text-navy hover:bg-gold/90">
              Mock pay (Razorpay UI)
            </Button>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Demo checkout calls a mock API—no real charges. JWT cookie refreshes with premium plan.
          </CardContent>
        </Card>
      )}

      {user.plan === "premium" && !user.chapter && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Join a chapter</CardTitle>
            <CardDescription>Select your city chapter and your exclusive category.</CardDescription>
          </CardHeader>
          <CardContent>
            <form className="flex flex-col gap-3 sm:flex-row sm:items-end" onSubmit={joinChapter}>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Chapter</label>
                <Select value={joinId} onValueChange={(v) => setJoinId(v ?? "")}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose chapter" />
                  </SelectTrigger>
                  <SelectContent>
                    {chapters.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name} — {c.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium">Your category</label>
                <Input value={joinCat} onChange={(e) => setJoinCat(e.target.value)} placeholder="e.g. Commercial Insurance" />
              </div>
              <Button type="submit" className="bg-navy text-white hover:bg-navy/90">
                Join
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Referrals</CardTitle>
            <CardDescription>Given vs received</CardDescription>
          </CardHeader>
          <CardContent>
            {user.plan !== "premium" ? (
              <p className="text-sm text-muted-foreground">Premium required</p>
            ) : stats ? (
              <div className="flex gap-8 text-2xl font-semibold">
                <div>
                  <p className="text-xs font-normal text-muted-foreground">Given</p>
                  {stats.given}
                </div>
                <div>
                  <p className="text-xs font-normal text-muted-foreground">Received</p>
                  {stats.received}
                </div>
              </div>
            ) : (
              <Skeleton className="h-10 w-24" />
            )}
            <Link href="/referrals" className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy hover:underline dark:text-gold">
              Manage referrals <ArrowRight className="size-4" />
            </Link>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Chapter</CardTitle>
            <CardDescription>Your current seat</CardDescription>
          </CardHeader>
          <CardContent className="text-sm">
            {user.chapter ? (
              <div>
                <p className="font-medium">{user.chapter.name}</p>
                <p className="text-muted-foreground">{user.chapter.city}</p>
                {user.category && <p className="mt-2 text-gold">Category: {user.category}</p>}
              </div>
            ) : (
              <p className="text-muted-foreground">
                {user.plan === "premium"
                  ? "Join a chapter from the Chapters page or ask your director."
                  : "Upgrade to premium to join a chapter."}
              </p>
            )}
            <Link href="/chapters" className="mt-4 inline-flex text-sm font-medium text-navy hover:underline dark:text-gold">
              Browse chapters →
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Upcoming meetings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {meetings.length === 0 && <p className="text-sm text-muted-foreground">No scheduled meetings in view.</p>}
          {meetings.map((m) => (
            <div key={m.id} className="flex items-center justify-between border-b border-border/60 pb-3 last:border-0 last:pb-0">
              <div>
                <p className="font-medium">{m.title}</p>
                <p className="text-xs text-muted-foreground">{new Date(m.startsAt).toLocaleString()}</p>
              </div>
              <Link href="/meetings" className="text-sm text-navy hover:underline dark:text-gold">
                Open
              </Link>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
