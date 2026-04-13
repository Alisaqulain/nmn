"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-user";
import { Skeleton } from "@/components/ui/skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function ProfilePage() {
  const { user, loading, refresh } = useUser();
  const [saving, setSaving] = useState(false);
  const [tq, setTq] = useState("");
  const [tMembers, setTMembers] = useState<{ id: string; name: string; businessName: string }[]>([]);
  const [tTarget, setTTarget] = useState("");

  useEffect(() => {
    if (!tq.trim()) {
      setTMembers([]);
      return;
    }
    const t = setTimeout(() => {
      fetch(`/api/users?q=${encodeURIComponent(tq)}`)
        .then((r) => r.json())
        .then((d) => setTMembers(d.members ?? []))
        .catch(() => setTMembers([]));
    }, 300);
    return () => clearTimeout(t);
  }, [tq]);

  useEffect(() => {
    if (!user) return;
    const form = document.getElementById("profile-form") as HTMLFormElement | null;
    if (!form) return;
    (form.elements.namedItem("name") as HTMLInputElement).value = user.name || "";
    (form.elements.namedItem("businessName") as HTMLInputElement).value = user.businessName || "";
    (form.elements.namedItem("category") as HTMLInputElement).value = user.category || "";
    (form.elements.namedItem("phone") as HTMLInputElement).value = user.phone || "";
    (form.elements.namedItem("location") as HTMLInputElement).value = user.location || "";
    (form.elements.namedItem("profileImage") as HTMLInputElement).value = user.profileImage || "";
    (form.elements.namedItem("bio") as HTMLTextAreaElement).value = user.bio || "";
  }, [user]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: String(fd.get("name") || ""),
      businessName: String(fd.get("businessName") || ""),
      category: String(fd.get("category") || ""),
      phone: String(fd.get("phone") || ""),
      location: String(fd.get("location") || ""),
      profileImage: String(fd.get("profileImage") || ""),
      bio: String(fd.get("bio") || ""),
    };
    const r = await fetch("/api/users/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const d = await r.json().catch(() => ({}));
    setSaving(false);
    if (!r.ok) {
      toast.error(d.error || "Save failed");
      return;
    }
    toast.success("Profile updated");
    refresh();
  }

  async function submitTestimonial(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!tTarget) {
      toast.error("Select a member");
      return;
    }
    const fd = new FormData(e.currentTarget);
    const r = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toUserId: tTarget,
        content: String(fd.get("content")),
        rating: Number(fd.get("rating") || 5),
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Failed");
      return;
    }
    toast.success("Testimonial submitted");
    setTTarget("");
    setTq("");
    e.currentTarget.reset();
  }

  if (loading || !user) {
    return <Skeleton className="h-96 w-full max-w-2xl" />;
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-navy dark:text-foreground">Profile</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Member profile</CardTitle>
          <CardDescription>Visible to your chapter. One category per chapter applies on join.</CardDescription>
        </CardHeader>
        <CardContent>
          <form id="profile-form" className="space-y-4" onSubmit={onSubmit}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" name="name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="businessName">Business name</Label>
                <Input id="businessName" name="businessName" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input id="category" name="category" placeholder="e.g. Financial Advisor" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="location">Location / City</Label>
                <Input id="location" name="location" />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="profileImage">Profile image URL</Label>
                <Input id="profileImage" name="profileImage" placeholder="https://..." />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" rows={4} />
              </div>
            </div>
            <Button type="submit" disabled={saving} className="bg-navy text-white hover:bg-navy/90">
              {saving ? "Saving…" : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Testimonial for a member</CardTitle>
          <CardDescription>Public praise for someone in your network (appears on the home page when approved).</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={submitTestimonial}>
            <div className="space-y-2">
              <Label>Member</Label>
              <Input value={tq} onChange={(e) => setTq(e.target.value)} placeholder="Search name or business…" />
              {tMembers.length > 0 && (
                <ScrollArea className="h-32 rounded-md border p-2">
                  {tMembers.map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      className="flex w-full flex-col rounded-md px-2 py-1 text-left text-sm hover:bg-muted"
                      onClick={() => {
                        setTTarget(m.id);
                        setTq(`${m.name} — ${m.businessName}`);
                        setTMembers([]);
                      }}
                    >
                      <span className="font-medium">{m.name}</span>
                      <span className="text-xs text-muted-foreground">{m.businessName}</span>
                    </button>
                  ))}
                </ScrollArea>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Testimonial</Label>
              <Textarea id="content" name="content" rows={4} minLength={10} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="rating">Rating (1–5)</Label>
              <Input id="rating" name="rating" type="number" min={1} max={5} defaultValue={5} />
            </div>
            <Button type="submit" variant="secondary">
              Submit testimonial
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
