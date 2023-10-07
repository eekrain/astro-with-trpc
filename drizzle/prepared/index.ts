import { sql } from "drizzle-orm";
import { db } from "..";

export const runtime = "edge";

export const pGetUserByEmail = db.query.users
  .findFirst({
    where: (user, { eq }) => eq(user.email, sql.placeholder("email")),
  })
  .prepare();

export const pGetUserById = db.query.users
  .findFirst({
    where: (user, { eq }) => eq(user.id, sql.placeholder("id")),
  })
  .prepare();

export const pGetUserByAccount = db.query.accounts
  .findFirst({
    where: (account, { eq, and }) =>
      and(
        eq(account.providerAccountId, sql.placeholder("providerAccountId")),
        eq(account.provider, sql.placeholder("provider"))
      ),
    with: {
      user: true,
    },
  })
  .prepare();

export const pGetSessionByToken = db.query.sessions
  .findFirst({
    where: (session, { eq }) =>
      eq(session.sessionToken, sql.placeholder("sessionToken")),
  })
  .prepare();

export const pGetSessionAndUser = db.query.sessions
  .findFirst({
    where: (session, { eq }) =>
      eq(session.sessionToken, sql.placeholder("sessionToken")),
    with: {
      user: true,
    },
  })
  .prepare();

export const pGetVerificationTokenByToken = db.query.verificationTokens
  .findFirst({
    where: (vt, { eq }) => eq(vt.token, sql.placeholder("token")),
  })
  .prepare();
