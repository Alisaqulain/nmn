"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function ForgotInner() {
  const searchParams = useSearchParams();
  const resetToken = searchParams.get("reset");
  const [loading, setLoading] = useState(false);

  async function requestReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const r = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const d = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      toast.error(d.error || "Request failed");
      return;
    }
    toast.success(d.message || "Check your email");
  }

  async function doReset(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!resetToken) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const password = String(fd.get("password") || "");
    const r = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token: resetToken, password }),
    });
    const d = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      toast.error(d.error || "Reset failed");
      return;
    }
    toast.success(d.message || "Password updated");
    window.location.href = "/login";
  }

  if (resetToken) {
    return (
      <Card className="border-border/80 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Set new password</CardTitle>
          <CardDescription>Choose a strong password for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={doReset}>
            <div className="space-y-2">
              <Label htmlFor="password">New password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <Button type="submit" className="w-full bg-navy text-white hover:bg-navy/90" disabled={loading}>
              {loading ? "Saving…" : "Update password"}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Forgot password</CardTitle>
        <CardDescription>We will email a reset link (mock: printed to server logs in development).</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={requestReset}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required />
          </div>
          <Button type="submit" className="w-full bg-navy text-white hover:bg-navy/90" disabled={loading}>
            {loading ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="text-navy hover:underline dark:text-gold">
              Back to login
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ForgotPasswordPage() {
  return (
    <Suspense fallback={<div className="h-40 animate-pulse rounded-xl bg-muted" />}>
      <ForgotInner />
    </Suspense>
  );
}
