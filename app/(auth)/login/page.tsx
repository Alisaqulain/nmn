"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/dashboard";
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const isDev = process.env.NODE_ENV !== "production";

  useEffect(() => {
    if (!isDev) return;
    // Helpful defaults for local demo; users can overwrite.
    setEmail("admin@nmn.demo");
    setPassword("Admin123!");
  }, [isDev]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const r = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const d = await r.json().catch(() => ({}));
    setLoading(false);
    if (!r.ok) {
      toast.error(d.error || "Login failed");
      return;
    }
    toast.success("Welcome back");
    router.push(next);
    router.refresh();
  }

  async function seedDemo() {
    setSeeding(true);
    try {
      const r = await fetch("/api/seed", { method: "POST" });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        toast.error(d.error || "Seeding failed");
        return;
      }
      toast.success("Demo data seeded");
      const admin = d?.credentials?.admin;
      if (admin?.email && admin?.password) {
        setEmail(String(admin.email));
        setPassword(String(admin.password));
      }
    } finally {
      setSeeding(false);
    }
  }

  return (
    <Card className="border-border/80 shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Log in</CardTitle>
        <CardDescription>Access your NMN dashboard and chapter tools.</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4" onSubmit={onSubmit}>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full bg-navy text-white hover:bg-navy/90" disabled={loading || seeding}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
          {isDev && (
            <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
              <p className="text-xs text-muted-foreground">
                Demo login (dev): <span className="font-medium text-foreground">admin@nmn.demo</span> /{" "}
                <span className="font-medium text-foreground">Admin123!</span>
              </p>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setEmail("admin@nmn.demo");
                    setPassword("Admin123!");
                  }}
                  disabled={loading || seeding}
                >
                  Use demo admin
                </Button>
                <Button type="button" variant="outline" className="w-full" onClick={seedDemo} disabled={loading || seeding}>
                  {seeding ? "Seeding…" : "Seed demo data"}
                </Button>
              </div>
            </div>
          )}
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/forgot-password" className="text-navy hover:underline dark:text-gold">
              Forgot password?
            </Link>
          </p>
          <p className="text-center text-sm text-muted-foreground">
            No account?{" "}
            <Link href="/signup" className="font-medium text-navy hover:underline dark:text-gold">
              Sign up
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="h-48 animate-pulse rounded-xl bg-muted" />}>
      <LoginForm />
    </Suspense>
  );
}
