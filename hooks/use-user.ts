"use client";

import { useCallback, useEffect, useState } from "react";

export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "member";
  plan: "free" | "premium";
  emailVerified?: boolean;
  businessName?: string;
  category?: string;
  phone?: string;
  bio?: string;
  profileImage?: string;
  location?: string;
  chapterId?: string | null;
  chapter?: { id: string; name?: string; city?: string } | null;
};

export function useUser() {
  const [user, setUser] = useState<AppUser | null | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const r = await fetch("/api/auth/me", { credentials: "include" });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) {
        setUser(null);
        return;
      }
      setUser(d.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, loading, refresh, isAdmin: user?.role === "admin", isPremium: user?.plan === "premium" };
}
