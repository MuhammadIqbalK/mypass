import { db } from "../db";
import { sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { cookies } from "next/headers";
import crypto from "crypto";

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

export async function createSession(userId: number, encryptionKey: Buffer) {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + SESSION_DURATION).toISOString();
  
  const result = await db
    .insert(sessions)
    .values({
      userId,
      token,
      encryptionKey: encryptionKey.toString('hex'), // Store as hex string
      expiresAt,
    })
    .returning();
    
  return result[0];
}

export async function deleteSession(token: string) {
  await db.delete(sessions).where(eq(sessions.token, token));
}

export async function setSessionCookie(token: string, encryptionKey: Buffer) {
  const cookieStore = await cookies();
  cookieStore.set("session_token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
  cookieStore.set("encryption_key", encryptionKey.toString('hex'), { // Store encryption key as hex string
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}