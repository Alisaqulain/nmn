"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useUser } from "@/hooks/use-user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type Meeting = {
  id: string;
  title: string;
  startsAt: string;
  attendance: { userId: string; present: boolean; memberName?: string }[];
};

export default function MeetingsPage() {
  const { user, loading } = useUser();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [chapters, setChapters] = useState<{ id: string; name: string; city: string }[]>([]);
  const [chapterId, setChapterId] = useState("");

  const load = () => {
    fetch("/api/meetings")
      .then((r) => r.json())
      .then((d) => setMeetings(d.meetings ?? []))
      .catch(() => setMeetings([]));
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (user?.role !== "admin") return;
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((d) => setChapters(d.chapters ?? []))
      .catch(() => setChapters([]));
  }, [user?.role]);

  async function createMeeting(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const startsAt = String(fd.get("startsAt"));
    const r = await fetch("/api/meetings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chapterId,
        title: String(fd.get("title") || "Weekly Chapter Meeting"),
        startsAt: new Date(startsAt).toISOString(),
        agenda: String(fd.get("agenda") || ""),
      }),
    });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) {
      toast.error(d.error || "Failed");
      return;
    }
    toast.success("Meeting scheduled");
    load();
  }

  async function toggleAttendance(meetingId: string, userId: string, present: boolean) {
    const r = await fetch(`/api/meetings/${meetingId}/attendance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, present }),
    });
    if (!r.ok) {
      toast.error("Could not update attendance");
      return;
    }
    load();
  }

  if (loading || !user) return null;

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy dark:text-foreground">Meetings</h1>
        <p className="text-sm text-muted-foreground">Weekly rhythm and attendance for your chapter.</p>
      </div>

      {user.role === "admin" && (
        <Card>
          <CardHeader>
            <CardTitle>Schedule meeting</CardTitle>
            <CardDescription>Creates roster slots from current chapter members.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Chapter</Label>
              <Select value={chapterId} onValueChange={(v) => setChapterId(v ?? "")}>
                <SelectTrigger>
                  <SelectValue placeholder="Select chapter" />
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
            <form className="space-y-3" onSubmit={createMeeting}>
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue="Weekly Chapter Meeting" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startsAt">Starts at (local)</Label>
                <Input id="startsAt" name="startsAt" type="datetime-local" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agenda">Agenda</Label>
                <Textarea id="agenda" name="agenda" rows={2} />
              </div>
              <Button type="submit" disabled={!chapterId} className="bg-navy text-white hover:bg-navy/90">
                Create
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {meetings.map((m) => (
          <Card key={m.id}>
            <CardHeader>
              <CardTitle className="text-lg">{m.title}</CardTitle>
              <CardDescription>{new Date(m.startsAt).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              {user.role === "admin" ? (
                <div className="space-y-3">
                  <p className="text-xs font-medium uppercase text-muted-foreground">Mark attendance</p>
                  {m.attendance.map((a) => (
                    <label key={a.userId} className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={a.present}
                        onCheckedChange={(c) => toggleAttendance(m.id, a.userId, Boolean(c))}
                      />
                      <span>{a.memberName || `Member ${a.userId.slice(-4)}`}</span>
                    </label>
                  ))}
                  {m.attendance.length === 0 && (
                    <p className="text-sm text-muted-foreground">No attendance rows (create from populated chapter).</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Your attendance is tracked by chapter leadership.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
        {meetings.length === 0 && <p className="text-sm text-muted-foreground">No meetings scheduled.</p>}
      </div>
    </div>
  );
}
