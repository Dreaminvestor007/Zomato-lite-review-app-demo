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
      <main className="mx-auto w-full max-w-[560px] px-6 pb-16 pt-6">
        <section className="rounded-2xl border border-black/5 bg-white p-5 shadow-sm">
          <h1 className="text-xl font-bold tracking-tight">
            {restaurantName ?? "Loading…"}
          </h1>
          <p className="mt-0.5 text-sm text-stone-500">
            Share your dining experience
          </p>

          <form onSubmit={handleSubmit} className="mt-6">
            <fieldset aria-describedby={error ? "form-error" : undefined}>
              <legend className="text-sm font-semibold">Rate it</legend>
              <div className="mt-3 flex gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    aria-pressed={rating === value}
                    aria-label={`${value} star${value > 1 ? "s" : ""}`}
                    className={`flex h-12 w-12 items-center justify-center rounded-lg border text-xl transition-colors ${
                      rating >= value
                        ? "border-rating bg-rating/10 text-rating"
                        : "border-stone-200 bg-white text-stone-300 hover:border-stone-300 hover:text-stone-400"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
              {rating >= 1 ? (
                <p className="mt-2 h-5 text-sm font-semibold text-rating">
                  {RATING_LABELS[rating]}
                </p>
              ) : (
                <p className="mt-2 h-5" />
              )}
            </fieldset>

            <div className="mt-5">
              <label htmlFor="comment" className="text-sm font-semibold">
                Your review
              </label>
              <textarea
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="How was the food, the service, the vibe?"
                className="mt-2.5 w-full resize-none rounded-lg border border-stone-200 bg-white px-4 py-3 text-base leading-relaxed placeholder:text-stone-400 focus:border-brand focus:outline-none"
              />
            </div>

            {error && (
              <p
                id="form-error"
                role="alert"
                className="mt-5 rounded-lg bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!canSubmit}
              className="mt-6 w-full rounded-lg bg-brand py-3 text-sm font-bold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:bg-stone-200 disabled:text-stone-400"
            >
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
}
