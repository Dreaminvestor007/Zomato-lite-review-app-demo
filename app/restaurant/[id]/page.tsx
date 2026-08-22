"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
}

interface RestaurantData {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
}

const CARD =
  "rounded-2xl border border-black/[0.04] bg-white shadow-[0_1px_2px_rgba(20,20,20,0.04),0_4px_16px_rgba(20,20,20,0.05)]";

function toneForRating(rating: number) {
  if (rating >= 4) return "bg-rating";
  if (rating >= 2) return "bg-rating-mid";
  return "bg-brand";
}

function toneForAverage(avg: number | null) {
  if (avg === null) return "bg-stone-300";
  if (avg >= 3.5) return "bg-rating";
  if (avg >= 2) return "bg-rating-mid";
  return "bg-brand";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeAgo(iso: string) {
  const minutes = (Date.now() - new Date(iso).getTime()) / 60000;
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${Math.floor(minutes)}m ago`;
  const hours = minutes / 60;
  if (hours < 24) return `${Math.floor(hours)}h ago`;
  const days = hours / 24;
  if (days < 30) return `${Math.floor(days)} day${days >= 2 ? "s" : ""} ago`;
  return formatDate(iso);
}

function RatingChip({ rating }: { rating: number }) {
  return (
    <span
      className={`inline-flex h-7 min-w-9 items-center justify-center rounded-lg px-1.5 text-sm font-bold text-white ${toneForRating(
        rating
      )}`}
    >
      {rating}
    </span>
  );
}

export default function RestaurantPage() {
  const params = useParams<{ id: string }>();
  const [data, setData] = useState<RestaurantData | null>(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${params.id}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        setData(await res.json());
      })
      .catch(() => setNotFound(true));
  }, [params.id]);

  if (notFound) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-[560px] px-6 py-16">
          <p className="text-sm text-stone-500">Restaurant not found.</p>
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <SiteHeader />
        <main className="mx-auto w-full max-w-[560px] px-6 pb-32 pt-4">
          <div className={`${CARD} animate-pulse overflow-hidden`}>
            <div className="h-28 bg-stone-200" />
            <div className="space-y-3 p-5">
              <div className="h-6 w-44 rounded-md bg-stone-200" />
              <div className="h-4 w-28 rounded bg-stone-100" />
            </div>
          </div>
        </main>
      </>
    );
  }

  const hasReviews = data.totalReviews > 0;
  const initials = data.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0]?.toUpperCase())
    .join("");

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[560px] px-6 pb-32 pt-4">
        <section className={`${CARD} rise overflow-hidden`}>
          <div className="relative h-28 bg-brand">
            <svg
              aria-hidden="true"
              className="absolute inset-0 h-full w-full opacity-15"
            >
              <defs>
                <pattern
                  id="hero-dots"
                  width="16"
                  height="16"
                  patternUnits="userSpaceOnUse"
                >
                  <circle cx="2" cy="2" r="1.5" fill="#fff" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dots)" />
            </svg>
            <span className="absolute bottom-3 left-5 text-4xl font-extrabold tracking-wider text-white/95">
              {initials}
            </span>
          </div>

          <div className="p-5 pt-4">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-[22px] font-extrabold leading-tight tracking-tight">
                  {data.name}
                </h1>
                <p className="mt-1 truncate text-sm text-stone-500">
                  {data.area}
                </p>
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                    {data.cuisine}
                  </span>
                  <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold text-stone-600">
                    Dine-in
                  </span>
                </div>
              </div>

              {hasReviews && (
                <div
                  className={`flex flex-col items-center rounded-xl px-3.5 py-2.5 text-white shadow-md ${toneForAverage(
                    data.averageRating
                  )}`}
                >
                  <span className="text-[26px] font-bold leading-none">
                    {data.averageRating ?? "–"}
                  </span>
                  <span className="mt-1 text-[10px] font-semibold opacity-90">
                    / 5
                  </span>
                </div>
              )}
            </div>

            <p className="mt-3 text-xs font-medium text-stone-400">
              {hasReviews
                ? `Based on ${data.totalReviews} ${
                    data.totalReviews === 1 ? "review" : "reviews"
                  }`
                : "Not rated yet"}
            </p>
          </div>
        </section>

        {hasReviews ? (
          <>
            {data.latestReview && (
              <section className="rise rise-1 mt-6">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Latest review
                </h2>
                <article
                  className={`${CARD} relative mt-2.5 rounded-tl-none border-l-4 border-l-rating p-5`}
                >
                  <span className="absolute -top-2.5 left-4 rounded-full bg-rating px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
                    Latest
                  </span>
                  <div className="flex items-center justify-between">
                    <RatingChip rating={data.latestReview.rating} />
                    <time
                      title={formatDate(data.latestReview.createdAt)}
                      className="text-xs font-medium text-stone-400"
                    >
                      {timeAgo(data.latestReview.createdAt)}
                    </time>
                  </div>
                  <p className="mt-3 text-[15px] leading-relaxed text-stone-800">
                    {data.latestReview.comment}
                  </p>
                </article>
              </section>
            )}

            {data.reviews.length > 0 && (
              <section className="rise rise-2 mt-7">
                <h2 className="text-xs font-bold uppercase tracking-widest text-stone-400">
                  Earlier reviews
                </h2>
                <ul className="mt-2.5 space-y-3">
                  {data.reviews.map((review) => (
                    <li key={review.id} className={`${CARD} p-4`}>
                      <div className="flex items-center justify-between">
                        <RatingChip rating={review.rating} />
                        <time
                          title={formatDate(review.createdAt)}
                          className="text-xs font-medium text-stone-400"
                        >
                          {timeAgo(review.createdAt)}
                        </time>
                      </div>
                      <p className="mt-2.5 text-sm leading-relaxed text-stone-700">
                        {review.comment}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </>
        ) : (
          <section className={`${CARD} rise rise-1 mt-6 p-10 text-center`}>
            <svg
              viewBox="0 0 64 64"
              aria-hidden="true"
              className="mx-auto h-16 w-16"
            >
              <circle
                cx="32"
                cy="32"
                r="26"
                fill="none"
                stroke="#d6d3d1"
                strokeWidth="3"
              />
              <circle
                cx="32"
                cy="32"
                r="17"
                fill="none"
                stroke="#e23744"
                strokeWidth="3"
                strokeDasharray="80 40"
                strokeLinecap="round"
              />
              <path
                d="M14 12v10M10 12v6a4 4 0 0 0 8 0v-6M50 12c-3 0-5 4-5 9v9h5V12zM50 30v22"
                stroke="#a8a29e"
                strokeWidth="3"
                strokeLinecap="round"
                fill="none"
              />
            </svg>
            <p className="mt-4 text-lg font-bold">No reviews yet</p>
            <p className="mt-1 text-sm text-stone-500">
              Be the first to tell people about {data.name}.
            </p>
          </section>
        )}

        <footer className="rise rise-3 mt-10 text-center text-xs text-stone-400">
          zomato-lite · reviews stored live in Postgres
        </footer>
      </main>

      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-black/5 bg-white/95 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
        <div className="mx-auto w-full max-w-[560px]">
          <Link
            href={`/review/${params.id}`}
            className="block w-full rounded-xl bg-brand py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-brand/25 transition-transform active:scale-[0.98]"
          >
            Write a Review
          </Link>
        </div>
      </div>
    </>
  );
}
