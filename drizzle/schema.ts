import { createTables as createAuthJSTables } from "./auth-js-schema";
import { sqliteTable } from "drizzle-orm/sqlite-core";

export const { users, accounts, sessions, verificationTokens } =
  createAuthJSTables(sqliteTable);
export const authJSSchema = { users, accounts, sessions, verificationTokens };
