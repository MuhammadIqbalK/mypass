import { db } from "../db";
import { passwords } from "../db/schema";
import { eq, and } from "drizzle-orm";
import { encrypt, decrypt } from "./encryption";
import zxcvbn from "zxcvbn";

export async function createPassword(
  userId: number,
  website: string,
  username: string,
  password: string,
  encryptionKey: Buffer,
  category?: string
) {
  // Encrypt the password using the master password as key
  const encryptedPassword = encrypt(password, encryptionKey);
  const strength = ((zxcvbn(password).score as number) === -1 ? null : (zxcvbn(password).score as number) + 1) as (1 | 2 | 3 | 4 | 5 | null); // zxcvbn score is 0-4, map to 1-5
  
  const result = await db
    .insert(passwords)
    .values({
      userId,
      website,
      username,
      encryptedPassword,
      category,
      strength,
    })
    .returning();
    
  return result[0];
}

export async function getPasswords(userId: number) {
  return await db.select().from(passwords).where(eq(passwords.userId, userId));
}

export async function getPasswordById(id: number, userId: number) {
  const result = await db
    .select()
    .from(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
    
  return result[0];
}

export async function updatePassword(
  id: number,
  userId: number,
  website: string,
  username: string,
  password: string,
  encryptionKey: Buffer,
  category?: string
) {
  // Encrypt the password using the master password as key
  const encryptedPassword = encrypt(password, encryptionKey);
  const strength = ((zxcvbn(password).score as number) === -1 ? null : (zxcvbn(password).score as number) + 1) as (1 | 2 | 3 | 4 | 5 | null); // zxcvbn score is 0-4, map to 1-5
  
  const result = await db
    .update(passwords)
    .set({
      website,
      username,
      encryptedPassword,
      category,
      strength,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(passwords.id, id), eq(passwords.userId, userId)))
    .returning();
    
  return result[0];
}

export async function deletePassword(id: number, userId: number) {
  await db
    .delete(passwords)
    .where(and(eq(passwords.id, id), eq(passwords.userId, userId)));
}

export function decryptPassword(encryptedPassword: string, encryptionKey: Buffer) {
  return decrypt(encryptedPassword, encryptionKey);
}