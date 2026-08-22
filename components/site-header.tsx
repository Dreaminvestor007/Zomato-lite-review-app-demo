export function SiteHeader() {
  return (
    <header className="sticky top-0 z-10 border-b border-black/5 bg-white">
      <div className="mx-auto flex h-14 w-full max-w-[560px] items-center px-6">
        <span className="text-[22px] font-extrabold tracking-tight text-brand">
          zomato<span className="-ml-1 font-semibold text-stone-400">-lite</span>
        </span>
      </div>
    </header>
  );
}
