import GitHub from "@auth/core/providers/github";
import { MyDrizzleAdapter } from "./drizzle/adapter/authjs";
import { db } from "./drizzle/migrate";
import { schemaAuthJS } from "./drizzle/schema";
import {
  pGetSessionAndUser,
  pGetSessionByToken,
  pGetUserByAccount,
  pGetUserByEmail,
  pGetUserById,
  pGetVerificationTokenByToken,
} from "./drizzle/prepared";

export default {
  // @ts-ignore
  adapter: MyDrizzleAdapter(db, {
    schemas: schemaAuthJS,
    prepared: {
      getSessionAndUser: pGetSessionAndUser,
      getSessionByToken: pGetSessionByToken,
      getUserByAccount: pGetUserByAccount,
      getUserByEmail: pGetUserByEmail,
      getUserById: pGetUserById,
      getVerificationTokenByToken: pGetVerificationTokenByToken,
    },
  }),
  providers: [
    GitHub({
      clientId: import.meta.env.GITHUB_CLIENT_ID,
      clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
    }),
  ],
};
