"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";

type RestaurantSummary = {
  name: string;
  cuisine: string;
  area: string;
};

export default function ReviewPage() {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const router = useRouter();
  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;

    fetch(`/api/restaurants/${restaurantId}`, { cache: "no-store" })
      .then(async (response) => {
        const data = (await response.json()) as RestaurantSummary;
        if (active && response.ok) {
          setRestaurantName(data.name);
        }
      })
      .catch(() => {
        // The submit error is the one that matters on this screen.
      });

    return () => {
      active = false;
    };
  }, [restaurantId]);

  const canSubmit = rating !== null && comment.trim().length > 0 && !submitting;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (rating === null) {
      return;
    }

    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: Number(restaurantId),
          rating,
          comment,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        setError(data?.error ?? "Could not submit the review.");
        setSubmitting(false);
        return;
      }

      router.push(`/restaurant/${restaurantId}`);
    } catch {
      setError("Could not reach the server. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-white px-5 py-8 text-ink sm:py-12">
      <div className="mx-auto w-full max-w-[680px]">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="text-sm text-muted transition-colors hover:text-zred"
        >
          ← Back to restaurant
        </Link>

        <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
          {restaurantName ?? "Ludhiana Burrito"}
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted">
          Write a review
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <fieldset>
            <legend className="text-sm font-medium">Your rating</legend>
            <div
              className="mt-3 flex gap-2"
              role="radiogroup"
              aria-label="Your rating"
            >
              {[1, 2, 3, 4, 5].map((value) => {
                const selected = rating !== null && value <= rating;

                return (
                  <button
                    key={value}
                    type="button"
                    role="radio"
                    aria-checked={rating === value}
                    aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
                    onClick={() => setRating(value)}
                    className={`text-3xl leading-none transition-colors ${
                      selected ? "text-zgreen" : "text-[#c9c9c9] hover:text-zgreen"
                    }`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </fieldset>

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium"
            >
              Your review
            </label>
            <textarea
              id="comment"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={4}
              placeholder="Tell us about your experience"
              className="mt-3 w-full resize-none rounded-lg border border-line bg-white px-4 py-3 text-base leading-7 outline-none transition-colors placeholder:text-muted/70 focus:border-zred"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg border border-zred/30 bg-accentSoft px-4 py-3 text-sm text-zred"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-accent px-5 py-3.5 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      </div>
    </main>
  );
}
