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
      <main className="min-h-screen bg-white px-5 py-12 text-ink">
        <div className="mx-auto w-full max-w-[680px]">
          <p className="text-sm text-muted">{error}</p>
        </div>
      </main>
    );
  }

  if (!restaurant) {
    return (
      <main className="min-h-screen bg-white px-5 py-12 text-ink">
        <div className="mx-auto w-full max-w-[680px]">
          <p className="text-sm text-muted">Loading...</p>
        </div>
      </main>
    );
  }

  const hasReviews = restaurant.totalReviews > 0;

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-ink sm:py-12">
      <div className="mx-auto w-full max-w-[680px]">
        <header className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zred">
            ZOMATO LITE
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            {restaurant.name}
          </h1>
          <p className="mt-2 text-sm text-muted">
            {restaurant.cuisine} • {restaurant.area}
          </p>
        </header>

        {!hasReviews ? (
          <section className="mt-8 rounded-2xl border border-line px-6 py-10 text-center">
            <h2 className="text-xl font-semibold">No reviews yet</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Be the first person to review this restaurant.
            </p>
          </section>
        ) : (
          <>
            <section className="mb-8 flex items-center gap-4 rounded-2xl border border-line bg-white px-5 py-4 shadow-sm">
              <div className="flex h-12 items-center rounded-lg bg-zgreen px-3 text-lg font-semibold text-white">
                {restaurant.averageRating} ★
              </div>
              <div>
                <p className="text-sm font-medium text-ink">Dining Rating</p>
                <p className="text-sm text-muted">
                  {restaurant.totalReviews} {restaurant.totalReviews === 1 ? "review" : "reviews"}
                </p>
              </div>
            </section>

            {restaurant.latestReview && (
              <section className="mb-6 rounded-2xl border border-line bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm font-semibold">Latest review</p>
                  <span className="rounded-md bg-zgreen px-2 py-1 text-xs font-medium text-white">
                    {restaurant.latestReview.rating} ★
                  </span>
                </div>
                <p className="text-base leading-6 text-ink">
                  {restaurant.latestReview.comment}
                </p>
                <div className="mt-3">
                  <ReviewDate value={restaurant.latestReview.createdAt} />
                </div>
              </section>
            )}

            {restaurant.reviews.length > 0 && (
              <section className="mb-8">
                <h2 className="mb-3 text-base font-semibold">All reviews</h2>
                <div className="space-y-4">
                  {restaurant.reviews.map((review) => (
                    <article key={review.id} className="rounded-2xl border border-line bg-white p-5 shadow-sm">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="rounded-md bg-zgreen px-2 py-1 text-xs font-medium text-white">
                          {review.rating} ★
                        </span>
                        <ReviewDate value={review.createdAt} />
                      </div>
                      <p className="leading-6 text-ink">{review.comment}</p>
                    </article>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        <Link
          href={`/review/${id}`}
          className="mt-10 inline-flex rounded-xl bg-white px-5 py-3.5 text-sm font-medium text-accent transition-opacity hover:opacity-90"
        >
          Add a review
        </Link>
      </div>
    </main>
  );
}
