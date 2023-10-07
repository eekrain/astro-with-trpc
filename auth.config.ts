import GitHub from "@auth/core/providers/github";
import Google from "@auth/core/providers/google";
import { SQLiteDrizzleAdapter } from "./drizzle/adapter/new";
import { generateDb } from "./drizzle/schema";

const db = generateDb({
  url: import.meta.env.TURSO_DB_URL || "",
  authToken: import.meta.env.TURSO_DB_AUTH_TOKEN || "",
});

export default {
  // @ts-ignore
  adapter: SQLiteDrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
    Google({
      clientId: import.meta.env.GOOGLE_CLIENT_ID,
      clientSecret: import.meta.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
};
