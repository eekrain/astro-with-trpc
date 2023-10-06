import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { authJSSchema } from "./schema";

interface Env {
  TURSO_DB_AUTH_TOKEN: string;
  TURSO_DB_URL: string;
}
export function buildAuthJSDB(env: Env) {
  return drizzle(
    createClient({ url: env.TURSO_DB_URL, authToken: env.TURSO_DB_AUTH_TOKEN }),
    {
      schema: authJSSchema,
    }
  );
}
