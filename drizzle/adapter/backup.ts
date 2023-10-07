import type { LibSQLDatabase, PreparedQuery } from "drizzle-orm/libsql";
import type {
  PreparedQueryConfig,
  SQLiteTableWithColumns,
} from "drizzle-orm/sqlite-core";
import type { Adapter, AdapterAccount } from "@auth/core/adapters";
import { and, eq } from "drizzle-orm";
import type {
  pGetSessionAndUser,
  pGetSessionByToken,
  pGetUserByAccount,
  pGetUserByEmail,
  pGetUserById,
  pGetVerificationTokenByToken,
} from "../prepared";

type PreparedStatement<T> = PreparedQuery<
  PreparedQueryConfig & {
    execute: T | undefined;
  }
>;

interface DrizzleAdapterConfig {
  schemas: {
    users: SQLiteTableWithColumns<any>;
    accounts: SQLiteTableWithColumns<any>;
    sessions: SQLiteTableWithColumns<any>;
    verificationTokens: SQLiteTableWithColumns<any>;
  };
  prepared: {
    getUserByEmail: typeof pGetUserByEmail;
    getUserById: typeof pGetUserById;
    getUserByAccount: typeof pGetUserByAccount;
    getSessionByToken: typeof pGetSessionByToken;
    getSessionAndUser: typeof pGetSessionAndUser;
    getVerificationTokenByToken: typeof pGetVerificationTokenByToken;
  };
}

export const MyDrizzleAdapter = (
  db: LibSQLDatabase,
  config: DrizzleAdapterConfig
): Adapter => {
  const s = config.schemas;
  const p = config.prepared;

  return {
    createUser: async (userData) => {
      const registered = await p.getUserByEmail.execute({
        email: userData.email,
      });

      if (registered?.email) return registered;

      const id = crypto.randomUUID();
      await db.insert(s.users).values({
        id,
        ...userData,
      });

      const user = await p.getUserById.execute({ id });
      if (!user) throw new Error("User not found");
      return user;
    },

    getUser: async (id: any) => {
      const user = await p.getUserById.execute({ id });
      return user ?? null;
    },

    getUserByEmail: async (email: any) => {
      const user = await p.getUserByEmail.execute({ email });
      return user ?? null;
    },

    getUserByAccount: async ({ provider, providerAccountId }: any) => {
      const account = await p.getUserByAccount.execute({
        provider,
        providerAccountId,
      });
      return account?.user ?? null;
    },

    // @ts-ignore
    updateUser: async ({ id, ...data }) => {
      await db.update(s.users).set(data).where(eq(s.users.id, id));
      const user = await p.getUserById.execute({ id });
      return user ?? null;
    },

    deleteUser: async (id: any) => {
      await db.delete(s.users).where(eq(s.users.id, id));
    },

    linkAccount: async (account) => {
      await db.insert(s.accounts).values({
        id: crypto.randomUUID(),
        provider: account.provider,
        providerAccountId: account.providerAccountId,
        type: account.type,
        userId: account.userId,
        accessToken: account.access_token,
        expiresAt: account.expires_at,
        idToken: account.id_token,
        refreshToken: account.refresh_token,
        scope: account.scope,
        sessionState: account.session_state,
        tokenType: account.token_type,
      });
    },

    unlinkAccount: async ({ provider, providerAccountId }) => {
      await db
        .delete(s.accounts)
        .where(
          and(
            eq(s.accounts.providerAccountId, providerAccountId),
            eq(s.accounts.provider, provider)
          )
        );
    },

    // @ts-ignore
    createSession: async (data: any) => {
      await db.insert(s.sessions).values(data);
      const session = await p.getSessionByToken.execute({
        sessionToken: data.sessionToken,
      });
      console.log("createSession", session);
      return session;
    },

    getSessionAndUser: async (sessionToken: any) => {
      const data = await p.getSessionAndUser.execute({ sessionToken });

      if (!data) return null;
      const { user, ...session } = data;
      return {
        user,
        session,
      };
    },

    updateSession: async (data: any) => {
      await db
        .update(s.sessions)
        .set(data)
        .where(eq(s.sessions.sessionToken, data.sessionToken));

      const session = await p.getSessionByToken.execute({
        sessionToken: data.sessionToken,
      });

      console.log("updateSession", session);
      return session ?? null;
    },

    deleteSession: async (sessionToken) => {
      await db
        .delete(s.sessions)
        .where(eq(s.sessions.sessionToken, sessionToken));
    },

    createVerificationToken: async (verificationToken) => {
      await db.insert(s.verificationTokens).values(verificationToken);
      const token = await p.getVerificationTokenByToken.execute({
        token: verificationToken.token,
      });
      console.log("createVerificationToken", token);
      return token ?? null;
    },

    useVerificationToken: async (verificationToken) => {
      const token = await p.getVerificationTokenByToken.execute({
        token: verificationToken.token,
      });

      console.log("useVerificationToken", token);
      if (!token) return null;
      await db
        .delete(s.verificationTokens)
        .where(
          and(
            eq(s.verificationTokens.token, verificationToken.token),
            eq(s.verificationTokens.identifier, verificationToken.identifier)
          )
        );
      return token;
    },
  };
};
