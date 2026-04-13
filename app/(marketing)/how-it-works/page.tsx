import type { Metadata } from "next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "How It Works",
};

export default function HowItWorksPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <h1 className="text-4xl font-semibold tracking-tight text-navy dark:text-foreground">How NMN works</h1>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        A simple operating system: show up, be specific, follow up. Technology keeps the loop visible.
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {[
          { t: "Apply & align", d: "We review your business category and chapter fit—protecting seat integrity." },
          { t: "Meet weekly", d: "Chapters run on time, every time. Attendance and referrals are visible to members." },
          { t: "Track referrals", d: "Give and receive with context. Dashboards show momentum—not just activity." },
        ].map((x) => (
          <Card key={x.t}>
            <CardHeader>
              <CardTitle className="text-lg">{x.t}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">{x.d}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
