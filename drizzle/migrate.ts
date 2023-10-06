import { migrate } from "drizzle-orm/libsql/migrator";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { config } from "dotenv";
import path from "path";

const envpath = path.join(process.cwd(), ".env");
console.log("🚀 ~ file: migrate.ts:8 ~ envpath:", envpath);

config();

const { TURSO_DB_URL: url, TURSO_DB_AUTH_TOKEN: authToken } = process.env;

if (!url || !authToken) {
  throw new Error("Some of env variables are missing");
}
export const client = createClient({
  url,
  authToken,
});

export const db = drizzle(client);

async function main() {
  try {
    await migrate(db, {
      migrationsFolder: "./drizzle/migrations",
    });
    console.log("Tables migrated!");
    process.exit(0);
  } catch (error) {
    console.error("Error performing migration: ", error);
    process.exit(1);
  }
}

main();
