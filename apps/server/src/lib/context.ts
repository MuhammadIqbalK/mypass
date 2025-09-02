import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { db } from "../db";
import { sessions } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";

type Session = {
  userId: number;
  encryptionKey: Buffer; // Add encryptionKey to Session type
} | null;

export async function createContext(req: NextRequest) {
  try {
    // Get the session token and encryption key from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get("session_token")?.value;
    const encryptionKeyHex = cookieStore.get("encryption_key")?.value; // Get encryption key from cookie
    
    if (!token || !encryptionKeyHex) { // Check for both token and encryption key
      return {
        session: null,
      };
    }
    
    // Check if the session is valid
    const result = await db
      .select()
      .from(sessions)
      .where(
        and(
          eq(sessions.token, token),
          gt(sessions.expiresAt, new Date().toISOString())
        )
      );
      
    const session = result[0];
    
    if (!session) {
      return {
        session: null,
      };
    }
    
    // Convert encryption key hex string back to Buffer
    const encryptionKey = Buffer.from(encryptionKeyHex, 'hex');

    return {
      session: {
        userId: session.userId,
        encryptionKey: encryptionKey, // Add encryptionKey to session context
      },
    };
  } catch (error) {
    console.error("Error in createContext:", error);
    return {
      session: null,
    };
  }
}

export type Context = {
  session: Session;
};
