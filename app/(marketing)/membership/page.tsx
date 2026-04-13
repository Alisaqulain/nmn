import type { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Membership Plans",
};

export default function MembershipPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-navy dark:text-foreground">Membership plans</h1>
      <p className="mt-4 text-muted-foreground">Choose how you want to participate. Upgrade anytime.</p>
      <div className="mt-12 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Free</CardTitle>
            <CardDescription>Explore the network</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Limited directory and event visibility.</p>
            <p>Profile basics only.</p>
          </CardContent>
        </Card>
        <Card className="border-gold/40 shadow-md">
          <CardHeader>
            <CardTitle>Premium</CardTitle>
            <CardDescription>Full referral & chapter access</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>Chapter placement, referrals, meetings, events, and testimonials.</p>
            <Link href="/signup" className={cn(buttonVariants(), "inline-flex bg-navy text-white hover:bg-navy/90")}>
              Get started
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
