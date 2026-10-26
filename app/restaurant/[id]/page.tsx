"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
};

type Restaurant = {
  name: string;
  cuisine: string;
  area: string;
  averageRating: number | null;
  totalReviews: number;
  latestReview: Review | null;
  reviews: Review[];
};

function ReviewDate({ value }: { value: string }) {
  return (
    <time dateTime={value} className="text-xs text-muted">
      {new Date(value).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}
    </time>
  );
}

export default function RestaurantPage() {
  const { id } = useParams<{ id: string }>();
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    fetch(`/api/restaurants/${id}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data?.error ?? "Could not load this restaurant.");
        }

        if (active) {
          setRestaurant(data);
        }
      })
      .catch((reason: Error) => {
        if (active) {
          setError(reason.message);
        }
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (error) {
    return (
      <main className="min-h-screen bg-paper px-5 py-20 text-ink">
        <div className="mx-auto w-full max-w-[560px]">
          <p className="text-sm text-muted">{error}</p>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-paper px-5 py-20 text-ink">
        <div className="mx-auto w-full max-w-[560px]">
          <p className="text-sm text-muted">Loading restaurant...</p>
        </div>
      </main>
    );
  }

  const hasReviews = restaurant.totalReviews > 0;

  return (
    <main className="min-h-screen bg-paper px-5 py-12 text-ink sm:py-20">
      <div className="mx-auto w-full max-w-[560px]">
        <header className="border-b border-line pb-9">
          <p className="text-xs uppercase tracking-[0.2em] text-accent">
            Ludhiana
          </p>
          <h1 className="mt-3 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
            {restaurant.name}
          </h1>
          <p className="mt-3 text-sm text-muted">
            {restaurant.cuisine} · {restaurant.area}
          </p>
        </header>

        {!hasReviews ? (
          <section className="mt-10 rounded-2xl border border-line px-6 py-12 text-center">
            <h2 className="font-serif text-2xl">No reviews yet.</h2>
            <p className="mt-3 text-sm leading-6 text-muted">
              Be the first person to say what you thought.
            </p>
          </section>
        ) : (
          <>
            <section className="flex items-end gap-3 py-10">
              <p className="font-serif text-7xl leading-none tracking-tight sm:text-8xl">
                {restaurant.averageRating}
              </p>
              <p className="mb-1 text-sm text-muted">
                stars · {restaurant.totalReviews}{" "}
                {restaurant.totalReviews === 1 ? "review" : "reviews"}
              </p>
            </section>

            {restaurant.latestReview && (
              <section className="rounded-2xl border border-accent/25 bg-accentSoft/70 px-6 py-6">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-accent">
                    Latest review
                  </p>
                  <p className="text-sm text-muted">
                    {restaurant.latestReview.rating} / 5
                  </p>
                </div>
                <p className="mt-4 text-lg leading-7">
                  {restaurant.latestReview.comment}
                </p>
                <div className="mt-4">
                  <ReviewDate value={restaurant.latestReview.createdAt} />
                </div>
              </section>
            )}

            {restaurant.reviews.length > 0 && (
              <section className="mt-12">
                <h2 className="text-xs uppercase tracking-[0.18em] text-muted">
                  Earlier reviews
                </h2>
                <div className="mt-4 divide-y divide-line border-y border-line">
                  {restaurant.reviews.map((review) => (
                    <article key={review.id} className="py-6">
                      <div className="flex items-center justify-between gap-4">
                        <p className="text-sm text-muted">{review.rating} / 5</p>
                        <ReviewDate value={review.createdAt} />
                      </div>
                      <p className="mt-3 leading-7">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <Link
          href={`/review/${id}`}
          className="mt-10 inline-flex rounded-xl bg-accent px-5 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90"
        >
          Write a review
        </Link>
      </div>
    </main>
  );
}
