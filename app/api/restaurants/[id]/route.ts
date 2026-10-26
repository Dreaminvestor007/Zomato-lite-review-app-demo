import { getSql } from "@/lib/db";

export const dynamic = "force-dynamic";

type ReviewRow = {
  id: number | string;
  rating: number | string;
  comment: string;
  created_at: string | Date;
};

function serializeReview(row: ReviewRow) {
  return {
    id: Number(row.id),
    rating: Number(row.rating),
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  if (!/^\d+$/.test(id)) {
    return Response.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurantId = Number(id);

  try {
    const sql = getSql();
    const restaurants = await sql`
      SELECT id, name, cuisine, area
      FROM restaurants
      WHERE id = ${restaurantId}
    `;

    if (restaurants.length === 0) {
      return Response.json({ error: "Restaurant not found." }, { status: 404 });
    }

    const stats = await sql`
      SELECT
        ROUND(AVG(rating)::numeric, 1) AS average_rating,
        COUNT(*)::int AS total_reviews
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
    `;

    const reviewRows = await sql`
      SELECT id, rating, comment, created_at
      FROM reviews
      WHERE restaurant_id = ${restaurantId}
      ORDER BY created_at DESC, id DESC
    `;

    const reviews = (reviewRows as ReviewRow[]).map(serializeReview);
    const restaurant = restaurants[0];

    return Response.json({
      name: restaurant.name,
      cuisine: restaurant.cuisine,
      area: restaurant.area,
      averageRating:
        reviews.length === 0 ? null : Number(stats[0].average_rating),
      totalReviews: Number(stats[0].total_reviews),
      latestReview: reviews[0] ?? null,
      reviews: reviews.slice(1),
    });
  } catch (error) {
    console.error("Could not load restaurant:", error);
    return Response.json(
      { error: "Something went wrong while loading the restaurant." },
      { status: 500 },
    );
  }
}
