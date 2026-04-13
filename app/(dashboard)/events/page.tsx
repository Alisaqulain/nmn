"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useUser } from "@/hooks/use-user";

type Ev = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  location: string;
  capacity: number;
  registered: number;
};

export default function EventsPage() {
  const { user, loading } = useUser();
  const [events, setEvents] = useState<Ev[]>([]);

  const load = () =>
    fetch("/api/events")
      .then((r) => r.json())
      .then((d) => setEvents(d.events ?? []));

  useEffect(() => {
    load();
  }, []);

  async function register(id: string) {
    const r = await fetch(`/api/events/${id}/register`, { method: "POST" });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Could not register");
      return;
    }
    toast.success(d.message === "Already registered" ? "Already registered" : "Registered");
    load();
  }

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy dark:text-foreground">Events & training</h1>
        <p className="text-sm text-muted-foreground">Workshops and intensives hosted by NMN.</p>
      </div>
      <div className="space-y-4">
        {events.map((e) => (
          <Card key={e.id}>
            <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
              <div>
                <CardTitle className="text-lg">{e.title}</CardTitle>
                <CardDescription>
                  {new Date(e.startsAt).toLocaleString()} — {new Date(e.endsAt).toLocaleString()}
                </CardDescription>
                {e.location && <p className="mt-1 text-sm text-muted-foreground">{e.location}</p>}
              </div>
              <Badge variant="secondary">
                {e.registered}/{e.capacity} seats
              </Badge>
            </CardHeader>
            <CardContent className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm text-muted-foreground">{e.description}</p>
              <Button
                type="button"
                onClick={() => register(e.id)}
                className="bg-navy text-white hover:bg-navy/90"
                disabled={user.plan === "free"}
              >
                {user.plan === "free" ? "Premium to register" : "Register"}
              </Button>
            </CardContent>
          </Card>
        ))}
        {events.length === 0 && <p className="text-sm text-muted-foreground">No upcoming events.</p>}
      </div>
    </div>
  );
}
