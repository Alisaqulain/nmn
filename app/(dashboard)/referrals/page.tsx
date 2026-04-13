"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Ref = {
  id: string;
  leadName: string;
  leadContact?: string;
  notes?: string;
  status: string;
  createdAt: string;
  from?: { name?: string } | null;
  to?: { name?: string } | null;
};

export default function ReferralsPage() {
  const { user, loading } = useUser();
  const [type, setType] = useState<"given" | "received">("given");
  const [list, setList] = useState<Ref[]>([]);
  const [stats, setStats] = useState<{ given: number; received: number } | null>(null);
  const [q, setQ] = useState("");
  const [members, setMembers] = useState<{ id: string; name: string; businessName: string; category: string }[]>([]);
  const [selected, setSelected] = useState<string>("");

  useEffect(() => {
    if (!user || user.plan !== "premium") return;
    fetch(`/api/referrals?type=${type}`)
      .then((r) => r.json())
      .then((d) => {
        setList(d.referrals ?? []);
        if (d.stats) setStats(d.stats);
      })
      .catch(() => setList([]));
  }, [user, type]);

  useEffect(() => {
    if (!q.trim() || user?.plan !== "premium") {
      setMembers([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/users?q=${encodeURIComponent(q)}`)
        .then((r) => r.json())
        .then((d) => setMembers(d.members ?? []))
        .catch(() => setMembers([]));
    }, 300);
    return () => clearTimeout(t);
  }, [q, user?.plan]);

  async function createReferral(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) {
      toast.error("Select a member");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/referrals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: selected,
        leadName: String(fd.get("leadName")),
        leadContact: String(fd.get("leadContact") || ""),
        notes: String(fd.get("notes") || ""),
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Failed");
      return;
    }
    toast.success("Referral sent");
    e.currentTarget.reset();
    setSelected("");
    setType("given");
    const res = await fetch("/api/referrals?type=given").then((x) => x.json());
    setList(res.referrals ?? []);
    if (res.stats) setStats(res.stats);
  }

  if (loading || !user) return null;

  if (user.plan !== "premium") {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Premium required</CardTitle>
          <CardDescription>Upgrade on the dashboard to unlock referrals.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy dark:text-foreground">Referrals</h1>
        {stats && (
          <p className="text-sm text-muted-foreground">
            Total given: {stats.given} · Total received: {stats.received}
          </p>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Give a referral</CardTitle>
          <CardDescription>Search members by name or business, then add lead details.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={createReferral}>
            <div className="space-y-2">
              <Label>Find member</Label>
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search…" />
              {members.length > 0 && (
                <ScrollArea className="h-36 rounded-md border p-2">
                  {members.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => {
                        setSelected(m.id);
                        setQ(`${m.name} — ${m.businessName}`);
                        setMembers([]);
                      }}
                      className="flex w-full flex-col items-start rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {m.businessName} · {m.category}
                      </span>
                    </button>
                  ))}
                </ScrollArea>
              )}
              {selected && <Badge variant="secondary">Recipient selected</Badge>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadName">Lead name</Label>
              <Input id="leadName" name="leadName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadContact">Lead contact</Label>
              <Input id="leadContact" name="leadContact" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" rows={3} />
            </div>
            <Button type="submit" className="bg-navy text-white hover:bg-navy/90">
              Submit referral
            </Button>
          </form>
        </CardContent>
      </Card>

      <Tabs value={type} onValueChange={(v) => setType(v as "given" | "received")}>
        <TabsList>
          <TabsTrigger value="given">Given</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
        <TabsContent value={type} className="mt-4 space-y-3">
          {list.map((r) => (
            <Card key={r.id}>
              <CardContent className="pt-6 text-sm">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-medium">{r.leadName}</p>
                  <Badge variant="outline">{r.status}</Badge>
                </div>
                {r.leadContact && <p className="text-muted-foreground">{r.leadContact}</p>}
                {r.notes && <p className="mt-1 text-muted-foreground">{r.notes}</p>}
                <p className="mt-2 text-xs text-muted-foreground">
                  {type === "given" ? `To: ${r.to?.name ?? "—"}` : `From: ${r.from?.name ?? "—"}`} ·{" "}
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
          {list.length === 0 && <p className="text-sm text-muted-foreground">No referrals in this view.</p>}
        </TabsContent>
      </Tabs>
    </div>
  );
}
