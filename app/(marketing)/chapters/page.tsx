"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Users } from "lucide-react";

type Chapter = {
  id: string;
  name: string;
  city: string;
  meetingDay: string;
  meetingTime: string;
  venueAddress: string;
  memberCount: number;
};

export default function ChaptersPage() {
  const [list, setList] = useState<Chapter[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((d) => setList(d.chapters ?? []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = list.filter(
    (c) =>
      !q.trim() ||
      c.name.toLowerCase().includes(q.toLowerCase()) ||
      c.city.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-navy dark:text-foreground">Chapters</h1>
      <p className="mt-4 text-muted-foreground">City-based chapters with weekly meetings and member rosters.</p>
      <div className="mt-8 max-w-md">
        <Input placeholder="Search by city or chapter name…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-40 rounded-xl" />)
          : filtered.map((c) => (
              <Card key={c.id} className="border-border/80">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{c.name}</CardTitle>
                    <Badge variant="secondary">{c.memberCount} members</Badge>
                  </div>
                  <CardDescription className="flex items-center gap-1.5">
                    <MapPin className="size-3.5" />
                    {c.city}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <p>
                    {c.meetingDay} · {c.meetingTime}
                  </p>
                  {c.venueAddress && <p>{c.venueAddress}</p>}
                  <Link href={`/chapters/${c.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-navy hover:underline dark:text-gold">
                    <Users className="size-4" />
                    View chapter
                  </Link>
                </CardContent>
              </Card>
            ))}
      </div>
    </div>
  );
}
