import Link from "next/link";

export default function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 bg-paper/95 backdrop-blur border-b border-line">
      <div className="mx-auto flex w-full max-w-[560px] items-center justify-between px-5 py-4">
        <Link href="/restaurant/1" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-white">
            <span className="text-sm font-semibold">ZL</span>
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Zomato Lite</p>
            <p className="mt-1 text-xs text-muted leading-none">Food reviews</p>
          </div>
        </Link>
        <Link
          href="/review/1"
          className="rounded-full bg-accent px-4 py-2 text-xs font-medium text-white transition-opacity hover:opacity-90"
        >
          Write a review
        </Link>
      </div>
    </header>
  );
}
