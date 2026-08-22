"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { SiteHeader } from "@/components/site-header";

const RATING_LABELS: Record<number, string> = {
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very good",
  5: "Excellent",
};

const CARD =
  "rounded-2xl border border-black/[0.04] bg-white shadow-[0_1px_2px_rgba(20,20,20,0.04),0_4px_16px_rgba(20,20,20,0.05)]";

export default function ReviewPage() {
  const params = useParams<{ restaurantId: string }>();
  const router = useRouter();

  const [restaurantName, setRestaurantName] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/restaurants/${params.restaurantId}`)
      .then(async (res) => {
        if (res.status === 404) {
          setNotFound(true);
          return;
        }
        const data = await res.json();
        setRestaurantName(data.name);
      })
      .catch(() => setNotFound(true));
  }, [params.restaurantId]);

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

  const canSubmit =
    rating >= 1 && comment.trim().length > 0 && !submitting;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          restaurantId: Number(params.restaurantId),
          rating,
          comment,
        }),
      });
      if (res.status === 201) {
        router.push(`/restaurant/${params.restaurantId}`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setError(
        typeof data.error === "string"
          ? data.error
          : `Request failed with status ${res.status}.`
      );
    } catch {
      setError("Could not reach the server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="mx-auto w-full max-w-[560px] px-6 pb-16 pt-5">
        <section className={`${CARD} rise p-6`}>
          <p className="text-xs font-bold uppercase tracking-widest text-stone-400">
            Writing a review for
          </p>
          <h1 className="mt-1 text-xl font-extrabold tracking-tight">
            {restaurantName ?? "Loading…"}
          </h1>

          <form onSubmit={handleSubmit} className="mt-7">
            <fieldset aria-describedby={error ? "form-error" : undefined}>
              <legend className="text-sm font-bold">Rate it</legend>
              <div className="mt-3.5 flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-pressed={rating === value}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className={`flex h-[52px] flex-1 items-center justify-center rounded-xl border text-2xl transition-all active:scale-90 ${
                      rating >= value
                        ? "border-rating bg-rating/10 text-rating"
                        : "border-stone-200 bg-white text-stone-300 hover:border-stone-300 hover:text-stone-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              <div className="mt-2.5 h-6 text-center">
                {rating >= 1 && (
                  <p
                    key={rating}
                    className="rise inline-block rounded-full bg-rating/10 px-3 py-1 text-sm font-bold text-rating"
                  >
                    {RATING_LABELS[rating]}
                  </p>
                )}
              </div>
            </fieldset>

            <div className="mt-4">
              <label htmlFor="comment" className="text-sm font-bold">
                Your review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                maxLength={500}
                placeholder="How was the food, the service, the vibe?"
                className="mt-2.5 w-full resize-none rounded-xl border border-stone-200 bg-white px-4 py-3 text-base leading-relaxed transition-shadow placeholder:text-stone-400 focus:border-brand focus:ring-4 focus:ring-brand/10 focus:outline-none"
              />
              <p className="mt-1 text-right text-xs text-stone-400">
                {comment.length}/500
              </p>
            </div>

            {error && (
              <p
                id="form-error"
                role="alert"
                className="rise mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 h-12 w-full rounded-xl bg-brand text-sm font-bold text-white shadow-lg shadow-brand/25 transition-all hover:bg-brand-dark active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400 disabled:shadow-none"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </section>

        <footer className="mt-8 text-center text-xs text-stone-400">
          Your review is public and cannot be edited or deleted.
        </footer>
      </main>
    </>
  );
}
