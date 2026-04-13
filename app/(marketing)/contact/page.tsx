"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [sending, setSending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    await new Promise((r) => setTimeout(r, 600));
    toast.success("Message recorded (demo). We will respond within one business day.");
    setSending(false);
    (e.target as HTMLFormElement).reset();
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-navy dark:text-foreground">Contact</h1>
      <p className="mt-4 text-muted-foreground">Partnerships, press, and chapter inquiries.</p>
      <Card className="mt-10">
        <CardHeader>
          <CardTitle>Send a note</CardTitle>
          <CardDescription>This form is a UI demo—no email backend is wired in this sample.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msg">Message</Label>
              <Textarea id="msg" name="msg" rows={4} required />
            </div>
            <Button type="submit" disabled={sending} className="bg-navy text-white hover:bg-navy/90">
              {sending ? "Sending…" : "Submit"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
