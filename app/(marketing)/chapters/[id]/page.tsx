"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ChapterDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [data, setData] = useState<{
    chapter: {
      name: string;
      city: string;
      description: string;
      meetingDay: string;
      meetingTime: string;
      venueName: string;
      venueAddress: string;
      members: { id: string; name: string; businessName: string; category: string; profileImage?: string }[];
    };
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch(`/api/chapters/${id}`)
      .then((r) => r.json())
      .then((j) => {
        if (j.error) setData(null);
        else setData(j);
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="mt-4 h-24 w-full" />
      </div>
    );
  }

  if (!data?.chapter) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <p className="text-muted-foreground">Chapter not found.</p>
        <Link href="/chapters" className="mt-4 inline-block text-sm text-navy hover:underline dark:text-gold">
          Back to chapters
        </Link>
      </div>
    );
  }

  const { chapter } = data;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <Link href="/chapters" className="text-sm text-muted-foreground hover:text-foreground">
        ← All chapters
      </Link>
      <h1 className="mt-4 text-4xl font-semibold tracking-tight text-navy dark:text-foreground">{chapter.name}</h1>
      <p className="mt-2 text-muted-foreground">
        {chapter.city} · {chapter.meetingDay} {chapter.meetingTime}
      </p>
      {chapter.venueName && (
        <p className="mt-1 text-sm text-muted-foreground">
          {chapter.venueName}
          {chapter.venueAddress ? ` · ${chapter.venueAddress}` : ""}
        </p>
      )}
      <p className="mt-6 text-muted-foreground">{chapter.description}</p>
      <div className="mt-8">
        <Link href="/signup" className={cn(buttonVariants(), "bg-navy text-white hover:bg-navy/90")}>
          Request to join
        </Link>
      </div>
      <h2 className="mt-14 text-xl font-semibold">Members</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {chapter.members.map((m) => (
          <Card key={m.id}>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <Avatar>
                <AvatarImage src={m.profileImage || undefined} />
                <AvatarFallback>{m.name?.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-base">{m.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{m.businessName}</p>
                <p className="text-xs text-gold">{m.category}</p>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
