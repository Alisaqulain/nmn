import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-muted/30 md:flex-row">
      <div className="relative hidden w-1/2 bg-navy p-12 text-white md:flex md:flex-col md:justify-between">
        <Link
          href="/"
          className="inline-flex w-fit rounded-xl bg-white px-5 py-3 shadow-md ring-1 ring-black/5"
        >
          <Image
            src="/assets/logo.jpeg"
            alt="National Millionaire Network"
            width={200}
            height={56}
            className="h-10 w-auto max-w-[min(100%,220px)] object-contain object-left"
            priority
          />
        </Link>
        <div>
          <p className="text-2xl font-semibold leading-snug">Referrals are the quietest growth channel.</p>
          <p className="mt-4 text-sm text-white/70">National Millionaire Network · Chapters · Accountability · Trust</p>
        </div>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
        <Link
          href="/"
          className="mb-8 inline-flex w-fit rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-black/10 md:hidden dark:ring-white/10"
        >
          <Image
            src="/assets/logo.jpeg"
            alt="National Millionaire Network"
            width={200}
            height={56}
            className="h-9 w-auto max-w-[200px] object-contain object-left"
            priority
          />
        </Link>
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
