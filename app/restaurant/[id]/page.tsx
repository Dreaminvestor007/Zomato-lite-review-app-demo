"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

function Stars({ rating }: { rating: number }) {
  return (
    <span className="text-accent" aria-label={`Rated ${rating} out of 5`}>
      {"★".repeat(rating)}
      <span className="text-stone-300">{"★".repeat(5 - rating)}</span>
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
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <p className="text-stone-500">Restaurant not found.</p>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="mx-auto w-full max-w-[560px] px-6 py-16">
        <p className="text-stone-500">Loading…</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[560px] px-6 py-16">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">{data.name}</h1>
        <p className="mt-1 text-sm text-stone-500">
          {data.cuisine} · {data.area}
        </p>
      </header>

      {data.totalReviews === 0 ? (
        <section className="mt-12 rounded-lg border border-dashed border-stone-300 p-10 text-center">
          <p className="text-lg font-medium">No reviews yet.</p>
          <p className="mt-1 text-sm text-stone-500">
            This place is waiting for its first honest opinion.
          </p>
          <Link
            href={`/review/${params.id}`}
            className="mt-6 inline-block rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-stone-700"
          >
            Write the first review
          </Link>
        </section>
      ) : (
        <>
          <section className="mt-10 flex items-baseline gap-3">
            <span className="text-7xl leading-none font-semibold tracking-tight tabular-nums">
              {data.averageRating ?? "–"}
            </span>
            <span className="text-sm text-stone-500">
              {data.totalReviews}{" "}
              {data.totalReviews === 1 ? "review" : "reviews"}
            </span>
          </section>

          {data.latestReview && (
            <section className="mt-10">
              <h2 className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Latest review
              </h2>
              <article className="mt-3 rounded-lg border border-stone-200 bg-white p-5">
                <div className="flex items-baseline justify-between gap-4">
                  <Stars rating={data.latestReview.rating} />
                  <time className="text-xs text-stone-400">
                    {formatDate(data.latestReview.createdAt)}
                  </time>
                </div>
                <p className="mt-3 leading-relaxed">
                  {data.latestReview.comment}
                </p>
              </article>
            </section>
          )}

          {data.reviews.length > 0 && (
            <section className="mt-10">
              <h2 className="text-xs font-medium uppercase tracking-wider text-stone-400">
                Earlier reviews
              </h2>
              <ul className="mt-3 divide-y divide-stone-200">
                {data.reviews.map((review) => (
                  <li key={review.id} className="py-4">
                    <div className="flex items-baseline justify-between gap-4">
                      <Stars rating={review.rating} />
                      <time className="text-xs text-stone-400">
                        {formatDate(review.createdAt)}
                      </time>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-stone-600">
                      {review.comment}
                    </p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </>
      )}

      <footer className="mt-14 border-t border-stone-200 pt-6">
        <Link
          href={`/review/${params.id}`}
          className="text-sm font-medium text-accent hover:underline"
        >
          Write a review
        </Link>
      </footer>
    </main>
  );
}
