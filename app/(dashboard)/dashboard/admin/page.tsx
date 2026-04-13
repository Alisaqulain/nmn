"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUser } from "@/hooks/use-user";
import { useRouter } from "next/navigation";
import { Skeleton } from "@/components/ui/skeleton";

export default function AdminPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [analytics, setAnalytics] = useState<{
    overview: Record<string, number>;
    recentReferrals: { id: string; leadName: string; from?: string; to?: string }[];
  } | null>(null);
  const [users, setUsers] = useState<
    { id: string; email: string; name: string; role: string; plan: string }[]
  >([]);
  const [referrals, setReferrals] = useState<
    { id: string; leadName: string; status: string; from: { name?: string } | null }[]
  >([]);
  const [chapters, setChapters] = useState<{ id: string; name: string; city: string; memberCount: number }[]>([]);

  useEffect(() => {
    if (!loading && user && user.role !== "admin") {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch("/api/admin/analytics")
      .then((r) => r.json())
      .then(setAnalytics)
      .catch(() => setAnalytics(null));
    fetch("/api/admin/users")
      .then((r) => r.json())
      .then((d) => setUsers(d.users ?? []));
    fetch("/api/admin/referrals")
      .then((r) => r.json())
      .then((d) => setReferrals(d.referrals ?? []));
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []));
  }, [user?.role]);

  async function updateUser(id: string, patch: { role?: string; plan?: string }) {
    const r = await fetch(`/api/admin/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (!r.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Updated");
    const d = await fetch("/api/admin/users").then((x) => x.json());
    setUsers(d.users ?? []);
  }

  async function updateReferralStatus(id: string, status: string) {
    const r = await fetch("/api/admin/referrals", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    if (!r.ok) {
      toast.error("Failed");
      return;
    }
    const d = await fetch("/api/admin/referrals").then((x) => x.json());
    setReferrals(d.referrals ?? []);
  }

  async function createChapter(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/chapters", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(fd.get("name")),
        city: String(fd.get("city")),
        description: String(fd.get("description") || ""),
        meetingDay: String(fd.get("meetingDay") || "Tuesday"),
        meetingTime: String(fd.get("meetingTime") || "7:00 AM"),
        venueAddress: String(fd.get("venueAddress") || ""),
        venueName: String(fd.get("venueName") || ""),
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Failed");
      return;
    }
    toast.success("Chapter created");
    const list = await fetch("/api/chapters").then((x) => x.json());
    setChapters(list.chapters ?? []);
    e.currentTarget.reset();
  }

  async function createEvent(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startsAt = new Date(String(fd.get("startsAt"))).toISOString();
    const endsAt = new Date(String(fd.get("endsAt"))).toISOString();
    const r = await fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: String(fd.get("title")),
        description: String(fd.get("description") || ""),
        startsAt,
        endsAt,
        location: String(fd.get("location") || ""),
        capacity: Number(fd.get("capacity") || 100),
      }),
    });
    if (!r.ok) {
      toast.error("Event create failed");
      return;
    }
    toast.success("Event created");
    e.currentTarget.reset();
  }

  if (loading || !user) {
    return <Skeleton className="h-96 w-full" />;
  }
  if (user.role !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy dark:text-foreground">Admin</h1>
        <p className="text-sm text-muted-foreground">Operate chapters, members, referrals, and events.</p>
      </div>

      <Tabs defaultValue="analytics">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="chapters">Chapters</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
          <TabsTrigger value="events">Events</TabsTrigger>
        </TabsList>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {analytics &&
              Object.entries(analytics.overview).map(([k, v]) => (
                <Card key={k}>
                  <CardHeader className="pb-2">
                    <CardDescription className="capitalize">{k}</CardDescription>
                    <CardTitle className="text-3xl">{v}</CardTitle>
                  </CardHeader>
                </Card>
              ))}
          </div>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent referrals</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {analytics?.recentReferrals?.map((r) => (
                <div key={r.id} className="flex justify-between border-b border-border/50 py-2 last:border-0">
                  <span>{r.leadName}</span>
                  <span className="text-muted-foreground">
                    {r.from} → {r.to}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Members</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Plan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>{u.name}</TableCell>
                      <TableCell className="max-w-[180px] truncate">{u.email}</TableCell>
                      <TableCell>
                        <Select
                          value={u.role}
                          onValueChange={(role) => {
                            if (role) updateUser(u.id, { role: role as "admin" | "member" });
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="member">member</SelectItem>
                            <SelectItem value="admin">admin</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={u.plan}
                          onValueChange={(plan) => {
                            if (plan) updateUser(u.id, { plan: plan as "free" | "premium" });
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="free">free</SelectItem>
                            <SelectItem value="premium">premium</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chapters" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Create chapter</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 sm:grid-cols-2" onSubmit={createChapter}>
                <div className="space-y-2">
                  <Label htmlFor="cname">Name</Label>
                  <Input id="cname" name="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ccity">City</Label>
                  <Input id="ccity" name="city" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="cdesc">Description</Label>
                  <Textarea id="cdesc" name="description" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cday">Meeting day</Label>
                  <Input id="cday" name="meetingDay" defaultValue="Tuesday" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ctime">Meeting time</Label>
                  <Input id="ctime" name="meetingTime" defaultValue="7:00 AM" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvenue">Venue name</Label>
                  <Input id="cvenue" name="venueName" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="caddr">Venue address</Label>
                  <Input id="caddr" name="venueAddress" />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="bg-navy text-white hover:bg-navy/90">
                    Create chapter
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Existing chapters</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              {chapters.map((c) => (
                <div key={c.id} className="flex justify-between border-b border-border/50 py-2">
                  <span>
                    {c.name} · {c.city}
                  </span>
                  <span className="text-muted-foreground">{c.memberCount} members</span>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>All referrals</CardTitle>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Lead</TableHead>
                    <TableHead>From</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {referrals.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{r.leadName}</TableCell>
                      <TableCell>{r.from?.name}</TableCell>
                      <TableCell>
                        <Select
                          value={r.status}
                          onValueChange={(s) => {
                            if (s) updateReferralStatus(r.id, s);
                          }}
                        >
                          <SelectTrigger className="w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="open">open</SelectItem>
                            <SelectItem value="won">won</SelectItem>
                            <SelectItem value="lost">lost</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Create event</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="grid gap-3 sm:grid-cols-2" onSubmit={createEvent}>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="etitle">Title</Label>
                  <Input id="etitle" name="title" required />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="edesc">Description</Label>
                  <Textarea id="edesc" name="description" rows={2} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="estart">Starts</Label>
                  <Input id="estart" name="startsAt" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eend">Ends</Label>
                  <Input id="eend" name="endsAt" type="datetime-local" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="eloc">Location</Label>
                  <Input id="eloc" name="location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ecap">Capacity</Label>
                  <Input id="ecap" name="capacity" type="number" defaultValue={100} />
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" className="bg-navy text-white hover:bg-navy/90">
                    Publish event
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
