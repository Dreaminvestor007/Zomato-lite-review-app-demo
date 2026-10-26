import { readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Pool } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not set. Add it to .env.local first.");
}

const here = path.dirname(fileURLToPath(import.meta.url));
const schema = await readFile(path.join(here, "..", "db", "schema.sql"), "utf8");
const pool = new Pool({ connectionString: databaseUrl, max: 1 });
const client = await pool.connect();

const seedReviews = [
  [5, "Paneer burrito is unreal", "8 days"],
  [4, "Good, but slow service", "6 days"],
  [4, "Solid. Would repeat.", "2 days"],
];

try {
  await client.query("BEGIN");
  await client.query("DROP TABLE IF EXISTS reviews");
  await client.query("DROP TABLE IF EXISTS restaurants");

  for (const statement of schema.split(";").map((sql) => sql.trim()).filter(Boolean)) {
    await client.query(statement);
  }

  const restaurant = await client.query(
    "INSERT INTO restaurants (name, cuisine, area) VALUES ($1, $2, $3) RETURNING id",
    ["Ludhiana Burrito", "Indian", "Sector 32"],
  );
  const restaurantId = restaurant.rows[0].id;

  for (const [rating, comment, age] of seedReviews) {
    await client.query(
      "INSERT INTO reviews (restaurant_id, rating, comment, created_at) VALUES ($1, $2, $3, NOW() - $4::interval)",
      [restaurantId, rating, comment, age],
    );
  }

  await client.query("COMMIT");

  const rows = await client.query(
    "SELECT id, restaurant_id, rating, comment, created_at FROM reviews ORDER BY created_at DESC",
  );

  console.log(`Created restaurant ${restaurantId}: Ludhiana Burrito`);
  console.table(rows.rows);
} catch (error) {
  await client.query("ROLLBACK");
  throw error;
} finally {
  client.release();
  await pool.end();
}
