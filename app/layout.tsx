import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    default: "National Millionaire Network | Referral Networking",
    template: "%s | NMN",
  },
  description:
    "Premium BNI-style referral networking with city chapters, category exclusivity, and member dashboards.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen font-sans antialiased", inter.variable)}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
