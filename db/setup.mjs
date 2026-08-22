import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set. Is .env.local present?");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

const schema = readFileSync(new URL("./schema.sql", import.meta.url), "utf8");
const statements = schema
  .split(";")
  .map((s) => s.trim())
  .filter(Boolean);

for (const statement of statements) {
  await sql.query(statement);
}

console.log(`db:setup complete — ${statements.length} statements applied.`);
