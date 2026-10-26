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
    <main className="min-h-screen bg-paper px-5 py-12 text-ink sm:py-20">
      <div className="mx-auto w-full max-w-[560px]">
        <Link
          href={`/restaurant/${restaurantId}`}
          className="text-sm text-muted underline decoration-line underline-offset-4 transition-colors hover:text-accent"
        >
          Back to restaurant
        </Link>

        <h1 className="mt-8 font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          {restaurantName ?? "Review Ludhiana Burrito"}
        </h1>
        <p className="mt-3 text-sm leading-6 text-muted">
          Tell people what you thought.
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
                    className={`text-4xl leading-none transition-colors ${
                      selected ? "text-accent" : "text-line hover:text-accent"
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
              rows={5}
              placeholder="What was good? What could be better?"
              className="mt-3 w-full resize-none rounded-xl border border-line bg-white/50 px-4 py-3 text-base leading-7 outline-none transition-colors placeholder:text-muted/70 focus:border-accent"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-xl border border-accent/30 bg-accentSoft px-4 py-3 text-sm text-accent"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full rounded-xl bg-accent px-5 py-3.5 text-sm font-medium text-paper transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-muted"
          >
            {submitting ? "Submitting..." : "Submit review"}
          </button>
        </form>
      </div>
    </main>
  );
}
