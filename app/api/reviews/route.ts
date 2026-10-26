import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ReviewInput = {
  restaurantId?: unknown;
  rating?: unknown;
  comment?: unknown;
};

function badRequest(error: string) {
  return Response.json({ error }, { status: 400 });
}

export async function POST(request: Request) {
  let input: ReviewInput;

  try {
    input = (await request.json()) as ReviewInput;
  } catch {
    return badRequest("Request body must be valid JSON.");
  }

  const { restaurantId, rating, comment } = input;

  if (
    typeof rating !== "number" ||
    !Number.isInteger(rating) ||
    rating < 1 ||
    rating > 5
  ) {
    return badRequest("Rating must be a whole number from 1 to 5.");
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return badRequest("Comment cannot be empty.");
  }

  if (
    typeof restaurantId !== "number" ||
    !Number.isInteger(restaurantId)
  ) {
    return badRequest("Restaurant not found.");
  }

  try {
    const sql = getSql();
    const restaurants = await sql`
      SELECT id FROM restaurants WHERE id = ${restaurantId}
    `;

    if (restaurants.length === 0) {
      return badRequest("Restaurant not found.");
    }

    const inserted = await sql`
      INSERT INTO reviews (restaurant_id, rating, comment)
      VALUES (${restaurantId}, ${rating}, ${comment.trim()})
      RETURNING id
    `;

    return Response.json(
      { success: true, reviewId: Number(inserted[0].id) },
      { status: 201 },
    );
  } catch (error) {
    console.error("Could not save review:", error);
    return Response.json(
      { error: "Something went wrong while saving the review." },
      { status: 500 },
    );
  }
}
