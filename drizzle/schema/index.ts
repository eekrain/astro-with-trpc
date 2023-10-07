import { sqliteTable } from "drizzle-orm/sqlite-core";
import { createTables } from "../adapter/new";
import { createClient } from "@libsql/client/.";
import { drizzle } from "drizzle-orm/libsql";

export const { users, accounts, sessions, verificationTokens } =
  createTables(sqliteTable);

export const schemaAuthJS = { users, accounts, sessions, verificationTokens };

export const generateDb = ({
  url,
  authToken,
}: {
  url: string;
  authToken: string;
}) => {
  const client = createClient({
    url,
    authToken,
  });

  return drizzle(client);
};
