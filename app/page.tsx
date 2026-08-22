import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <p className="text-stone-500">zomato-lite is alive</p>
        <Link
          href="/restaurant/1"
          className="mt-3 inline-block text-sm font-medium text-accent hover:underline"
        >
          Open Ludhiana Burrito →
        </Link>
      </div>
    </main>
  );
}
