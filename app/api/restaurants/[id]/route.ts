import { NextResponse } from "next/server";
import { sql } from "@/db/client";

interface RestaurantRow {
  name: string;
  cuisine: string;
  area: string;
}

interface StatsRow {
  total: number;
  average: number | null;
}

interface ReviewRow {
  id: number;
  rating: number;
  comment: string;
  created_at: string | Date;
}

function serializeReview(row: ReviewRow) {
  return {
    id: row.id,
    rating: row.rating,
    comment: row.comment,
    createdAt: new Date(row.created_at).toISOString(),
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const restaurantId = Number(id);

  if (!Number.isInteger(restaurantId)) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const restaurantRows = await sql`
    SELECT name, cuisine, area FROM restaurants WHERE id = ${restaurantId}
  `;
  const restaurant = restaurantRows[0] as RestaurantRow | undefined;

  if (!restaurant) {
    return NextResponse.json({ error: "Restaurant not found." }, { status: 404 });
  }

  const statsRows = await sql`
    SELECT COUNT(*)::int AS total, ROUND(AVG(rating)::numeric, 1)::float AS average
    FROM reviews WHERE restaurant_id = ${restaurantId}
  `;
  const stats = statsRows[0] as StatsRow;

  const reviewRows = (await sql`
    SELECT id, rating, comment, created_at
    FROM reviews
    WHERE restaurant_id = ${restaurantId}
    ORDER BY created_at DESC
  `) as ReviewRow[];

  const [latest, ...older] = reviewRows;

  return NextResponse.json({
    name: restaurant.name,
    cuisine: restaurant.cuisine,
    area: restaurant.area,
    averageRating: stats.average ?? null,
    totalReviews: stats.total,
    latestReview: latest ? serializeReview(latest) : null,
    reviews: older.map(serializeReview),
  });
}
