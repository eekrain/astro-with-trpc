// import { drizzle } from "drizzle-orm/planetscale-serverless";
import { drizzle } from "drizzle-orm/libsql";

import { schemaAuthJS } from "./schema/index";
import { createClient } from "@libsql/client";
import "dotenv/config";

const databaseURL = process.env["TURSO_DB_URL"];
const authToken = process.env["TURSO_DB_AUTH_TOKEN"];
if (!databaseURL || !authToken)
  throw new Error("Enviromental database Url not");

const client = createClient({
  url: databaseURL,
  authToken: authToken,
});

export const adapterDB = drizzle(client);
export const db = drizzle(client, {
  schema: schemaAuthJS,
});
