import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

const PERKS = [
  { title: "Rate in seconds", desc: "Tap stars, type a line, done." },
  { title: "Real reviews only", desc: "Straight from diners, no fluff." },
  { title: "Zero signup", desc: "No accounts. No passwords. Ever." },
];

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[560px] px-6 pb-16 pt-10">
        <section className="rise rounded-2xl bg-brand p-8 text-center text-white shadow-lg shadow-brand/25">
          <span className="text-4xl font-extrabold tracking-tight">
            zomato<span className="-ml-1 font-semibold text-white/70">-lite</span>
          </span>
          <p className="mt-2 text-sm font-medium text-white/85">
            Honest reviews. One burrito at a time.
          </p>
        </section>

        <ul className="rise rise-1 mt-5 space-y-2.5">
          {PERKS.map((perk) => (
            <li
              key={perk.title}
              className="flex items-center gap-3.5 rounded-2xl border border-black/[0.04] bg-white p-4 shadow-[0_1px_2px_rgba(20,20,20,0.04),0_4px_16px_rgba(20,20,20,0.05)]"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10">
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5 fill-brand">
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z" />
                </svg>
              </span>
              <div>
                <p className="text-sm font-bold">{perk.title}</p>
                <p className="text-xs text-stone-500">{perk.desc}</p>
              </div>
            </li>
          ))}
        </ul>

        <Link
          href="/restaurant/1"
          className="rise rise-2 mt-6 block rounded-xl bg-brand py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand/25 transition-transform active:scale-[0.98]"
        >
          Explore Ludhiana Burrito
        </Link>

        <footer className="rise rise-3 mt-8 text-center text-xs text-stone-400">
          zomato-lite · built with Next.js + Neon Postgres
        </footer>
      </main>
    </>
  );
}
