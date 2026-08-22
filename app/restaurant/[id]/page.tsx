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

function RatingChip({ rating }: { rating: number }) {
  return (
    <span className="inline-flex h-7 min-w-9 items-center justify-center rounded-md bg-rating px-1.5 text-sm font-bold text-white">
      {rating}
    </span>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
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
        <main className="mx-auto w-full max-w-[560px] animate-pulse px-6 py-16">
          <div className="h-8 w-48 rounded-lg bg-stone-200" />
          <div className="mt-4 h-24 rounded-2xl bg-stone-200/70" />
        </main>
      </>
    );
  }

  const hasReviews = data.totalReviews > 0;

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[560px] px-6 pb-16 pt-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-[22px] font-bold leading-tight tracking-tight">
                {data.name}
              </h1>
              <p className="mt-1 text-sm text-stone-500">{data.area}</p>
              <div className="mt-2.5 flex flex-wrap gap-1.5">
                <span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-medium text-stone-600">
                  {data.cuisine}
                </span>
              </div>
            </div>

            {hasReviews && (
              <div className="flex flex-col items-center rounded-xl bg-rating px-3.5 py-2.5 text-white">
                <span className="text-[26px] font-bold leading-none">
                  {data.averageRating ?? "–"}
                </span>
                <span className="mt-1 text-[10px] font-semibold opacity-90">
                  / 5
                </span>
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-stone-400">
            {hasReviews
              ? `${data.totalReviews} ${
                  data.totalReviews === 1 ? "diner has" : "diners have"
                } rated this place`
              : "Not rated yet"}
          </p>

          <Link
            href={`/review/${params.id}`}
            className="mt-4 block w-full rounded-lg bg-brand py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Write a Review
          </Link>
        </section>

        {hasReviews ? (
          <>
            {data.latestReview && (
              <section className="relative mt-7 rounded-2xl rounded-tl-none border border-rating/25 border-l-4 border-l-rating bg-white p-5 shadow-sm">
                <span className="absolute -top-2.5 left-4 rounded-full bg-rating px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                  Latest
                </span>
                <div className="flex items-center justify-between">
                  <RatingChip rating={data.latestReview.rating} />
                  <time className="text-xs text-stone-400">
                    {formatDate(data.latestReview.createdAt)}
                  </time>
                </div>
                <p className="mt-3 text-[15px] leading-relaxed text-stone-800">
                  {data.latestReview.comment}
                </p>
              </section>
            )}

            {data.reviews.length > 0 && (
              <section className="mt-7">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-500">
                  Earlier reviews
                </h2>
                <ul className="mt-3 space-y-3">
                  {data.reviews.map((review) => (
                    <li
                      key={review.id}
                      className="rounded-2xl border border-black/5 bg-white p-4 shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <RatingChip rating={review.rating} />
                        <time className="text-xs text-stone-400">
                          {formatDate(review.createdAt)}
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
          <section className="mt-7 rounded-2xl border-2 border-dashed border-stone-300 bg-white p-10 text-center">
            <svg
              viewBox="0 0 20 20"
              aria-hidden="true"
              className="mx-auto h-12 w-12 text-rating"
            >
              <path
                fill="currentColor"
                d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8L10 14.9l-5.3 2.7 1-5.8L1.5 7.7l5.9-.9L10 1.5z"
              />
            </svg>
            <p className="mt-4 text-lg font-bold">No reviews yet</p>
            <p className="mt-1 text-sm text-stone-500">
              Be the first to tell people about {data.name}.
            </p>
          </section>
        )}
      </main>
    </>
  );
}
