import { NextResponse } from "next/server";
import { sql } from "@/db/client";

interface ExistingRestaurant {
  id: number;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { restaurantId, rating, comment } = body as {
    restaurantId?: unknown;
    rating?: unknown;
    comment?: unknown;
  };

  if (typeof rating !== "number" || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return NextResponse.json(
      { error: "Rating must be a whole number from 1 to 5." },
      { status: 400 }
    );
  }

  if (typeof comment !== "string" || comment.trim().length === 0) {
    return NextResponse.json(
      { error: "Comment cannot be empty." },
      { status: 400 }
    );
  }

  let existingRestaurant: ExistingRestaurant | undefined;
  if (typeof restaurantId === "number" && Number.isInteger(restaurantId)) {
    const rows = await sql`SELECT id FROM restaurants WHERE id = ${restaurantId}`;
    existingRestaurant = rows[0] as ExistingRestaurant | undefined;
  }
  if (!existingRestaurant) {
    return NextResponse.json(
      { error: "That restaurant does not exist." },
      { status: 400 }
    );
  }

  const inserted = await sql`
    INSERT INTO reviews (restaurant_id, rating, comment)
    VALUES (${restaurantId as number}, ${rating}, ${comment.trim()})
    RETURNING id
  `;
  const review = inserted[0] as { id: number };

  return NextResponse.json({ success: true, reviewId: review.id }, { status: 201 });
}
