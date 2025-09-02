import bcrypt from "bcryptjs";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto"; // Import crypto for randomBytes

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return result[0];
}

export async function createUser(email: string, password: string) {
  const hashedPassword = await hashPassword(password);
  const dataEncryptionSalt = crypto.randomBytes(16).toString('hex'); // Generate persistent salt
  const result = await db
    .insert(users)
    .values({
      email,
      masterPasswordHash: hashedPassword,
      dataEncryptionSalt: dataEncryptionSalt, // Store persistent salt
    })
    .returning();
  return result[0];
}