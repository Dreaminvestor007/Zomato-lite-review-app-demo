export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-black/5 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-[560px] items-center justify-between px-6">
        <span className="text-[22px] font-extrabold tracking-tight text-brand">
          zomato<span className="-ml-1 font-semibold text-stone-400">-lite</span>
        </span>
        <span className="rounded-full bg-brand/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand">
          Beta
        </span>
      </div>
    </header>
  );
}
