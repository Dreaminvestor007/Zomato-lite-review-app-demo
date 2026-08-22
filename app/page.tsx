import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex min-h-[calc(100dvh-56px)] items-center justify-center px-6 pb-16">
        <div className="w-full max-w-[560px] rounded-2xl border border-black/5 bg-white p-10 text-center shadow-sm">
          <span className="text-4xl font-extrabold tracking-tight text-brand">
            zomato<span className="-ml-1 font-semibold text-stone-400">-lite</span>
          </span>
          <p className="mt-2 text-sm text-stone-500">
            Honest reviews. One burrito at a time.
          </p>
          <Link
            href="/restaurant/1"
            className="mt-7 inline-block rounded-full bg-brand px-7 py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
          >
            Explore Ludhiana Burrito
          </Link>
        </div>
      </main>
    </>
  );
}
