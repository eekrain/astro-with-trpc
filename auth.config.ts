import GitHub from "@auth/core/providers/github";
import { db } from "./drizzle/migrate";
import { SQLiteDrizzleAdapter } from "./drizzle/adapter/new";

export default {
  // @ts-ignore
  adapter: SQLiteDrizzleAdapter(db),
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
