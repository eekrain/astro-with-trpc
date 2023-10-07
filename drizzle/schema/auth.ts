import {
  integer,
  text,
  primaryKey,
  SQLiteTableFn,
} from "drizzle-orm/sqlite-core";

import type { AdapterAccount } from "@auth/core/adapters";

export function createAuthJSTables(sqliteTable: SQLiteTableFn) {
  const users = sqliteTable("user", {
    id: text("id").notNull().primaryKey(),
    name: text("name"),
    email: text("email").notNull(),
    emailVerified: integer("emailVerified", { mode: "timestamp_ms" }),
    image: text("image"),
  });

  const accounts = sqliteTable(
    "account",
    {
      userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccount["type"]>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    },
    (account) => ({
      compoundKey: primaryKey(account.provider, account.providerAccountId),
    })
  );

  const sessions = sqliteTable("session", {
    sessionToken: text("sessionToken").notNull().primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
  });

  const verificationTokens = sqliteTable(
    "verificationToken",
    {
      identifier: text("identifier").notNull(),
      token: text("token").notNull(),
      expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
    },
    (vt) => ({
      compoundKey: primaryKey(vt.identifier, vt.token),
    })
  );

  return { users, accounts, sessions, verificationTokens };
}
