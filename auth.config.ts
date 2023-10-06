import GitHub from "@auth/core/providers/github";
import { buildAuthJSDB } from "./drizzle/client";
import { DrizzleAdapter } from "@auth/drizzle-adapter";

const db = buildAuthJSDB({
  TURSO_DB_URL: import.meta.env.TURSO_DB_URL,
  TURSO_DB_AUTH_TOKEN: import.meta.env.TURSO_DB_AUTH_TOKEN,
});

export default {
  // @ts-ignore
  adapter: DrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
