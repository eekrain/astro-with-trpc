import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createTables } from "../adapter/new";

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable);

export const schemaAuthJS = { users, accounts, sessions, verificationTokens };
