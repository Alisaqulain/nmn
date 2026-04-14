"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import {
  Bell,
  CalendarDays,
  Gift,
  LayoutDashboard,
  LogOut,
  Menu,
  Shield,
  UserCircle,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/hooks/use-user";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

const memberNav = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/profile", label: "Profile", icon: UserCircle },
  { href: "/referrals", label: "Referrals", icon: Gift },
  { href: "/meetings", label: "Meetings", icon: CalendarDays },
  { href: "/events", label: "Events", icon: Users },
];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading } = useUser();
  const [notes, setNotes] = useState<{ id: string; title: string; message: string; read: boolean }[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetch("/api/notifications")
      .then((r) => r.json())
      .then((d) => setNotes(d.notifications ?? []))
      .catch(() => setNotes([]));
  }, [user]);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    toast.success("Signed out");
    router.push("/login");
    router.refresh();
  }

  const unread = notes.filter((n) => !n.read).length;

  const Nav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 px-2">
      {memberNav.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className={cn(
              buttonVariants({ variant: active ? "secondary" : "ghost", size: "sm" }),
              "justify-start gap-2",
              active && "bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
      {user?.role === "admin" && (
        <Link
          href="/dashboard/admin"
          onClick={onNavigate}
          className={cn(
            buttonVariants({ variant: pathname.startsWith("/dashboard/admin") ? "secondary" : "ghost", size: "sm" }),
            "justify-start gap-2",
            pathname.startsWith("/dashboard/admin") && "bg-navy/10 text-navy dark:bg-gold/10 dark:text-gold"
          )}
        >
          <Shield className="size-4" />
          Admin
        </Link>
      )}
      <button
        type="button"
        onClick={async () => {
          onNavigate?.();
          await logout();
        }}
        className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mt-2 justify-start gap-2 text-muted-foreground")}
      >
        <LogOut className="size-4" />
        Log out
      </button>
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-muted/20">
      <aside className="hidden w-60 shrink-0 border-r border-border/60 bg-card md:flex md:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-border/60 px-4">
          <Image src="/assets/logo.jpeg" alt="NMN" width={120} height={32} className="h-7 w-auto" />
        </div>
        <ScrollArea className="flex-1 py-4">
          <Nav />
        </ScrollArea>
        <div className="border-t border-border/60 p-4 text-xs text-muted-foreground">
          {loading ? "…" : user?.email}
          <div className="mt-1 flex gap-2">
            <Badge variant={user?.plan === "premium" ? "default" : "secondary"} className="text-[10px]">
              {user?.plan}
            </Badge>
            <Badge variant="outline" className="text-[10px]">
              {user?.role}
            </Badge>
          </div>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-2">
            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
              <SheetTrigger
                className={cn(buttonVariants({ variant: "outline", size: "icon" }), "md:hidden")}
                aria-label="Open sidebar"
              >
                <Menu className="size-4" />
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0">
                <div className="flex h-16 items-center border-b px-4">
                  <Image src="/assets/logo.jpeg" alt="NMN" width={110} height={28} className="h-6 w-auto" />
                </div>
                <div className="p-2">
                  <Nav onNavigate={() => setMenuOpen(false)} />
                </div>
              </SheetContent>
            </Sheet>
            <span className="text-sm font-medium text-muted-foreground md:hidden">NMN</span>
          </div>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger
                className={cn(
                  buttonVariants({ variant: "outline", size: "icon" }),
                  "relative"
                )}
                aria-label="Notifications"
              >
                <Bell className="size-4" />
                {unread > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-navy">
                    {unread > 9 ? "9+" : unread}
                  </span>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notes.length === 0 && <div className="px-2 py-4 text-sm text-muted-foreground">No notifications</div>}
                {notes.slice(0, 8).map((n) => (
                  <DropdownMenuItem
                    key={n.id}
                    className="flex flex-col items-start gap-0.5"
                    onClick={async () => {
                      await fetch(`/api/notifications/${n.id}`, {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ read: true }),
                      });
                      setNotes((prev) => prev.map((x) => (x.id === n.id ? { ...x, read: true } : x)));
                    }}
                  >
                    <span className="font-medium">{n.title}</span>
                    <span className="text-xs text-muted-foreground">{n.message}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <button
              type="button"
              onClick={() => logout()}
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              aria-label="Log out"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
