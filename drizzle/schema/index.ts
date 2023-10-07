import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createAuthJSTables } from "./auth";

export const { users, accounts, sessions, verificationTokens } =
  createAuthJSTables(sqliteTable);

export const schemaAuthJS = { users, accounts, sessions, verificationTokens };
