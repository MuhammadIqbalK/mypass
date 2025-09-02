import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";
import { createUser, getUserByEmail, verifyPassword } from "../lib/auth";
import { createSession, setSessionCookie } from "../lib/sessions";
import { cookies } from "next/headers";
import { deriveKey } from "../lib/encryption"; // Import deriveKey
import crypto from "crypto"; // Import crypto for randomBytes

export const authRouter = router({
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(8),
      })
    )
    .mutation(async ({ input }) => {
      // Validate that we have the required fields
      if (!input.email || !input.password) {
        throw new Error("Missing required fields: email and password are required");
      }
      
      if (typeof input.email !== 'string' || typeof input.password !== 'string') {
        throw new Error("Invalid field types: email and password must be strings");
      }
      
      const existingUser = await getUserByEmail(input.email);
      if (existingUser) {
        throw new Error("User already exists");
      }
      
      const user = await createUser(input.email, input.password);
      
      // Derive encryption key from the provided master password during registration
      const encryptionSalt = crypto.randomBytes(16); // Generate a new salt for session encryption key
      const encryptionKey = deriveKey(input.password, encryptionSalt);
      
      const session = await createSession(user.id, encryptionKey); // Pass encryptionKey to createSession
      setSessionCookie(session.token, encryptionKey); // Pass encryptionKey to setSessionCookie
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }),
    
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await getUserByEmail(input.email);
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      const isValid = await verifyPassword(input.password, user.masterPasswordHash);
      if (!isValid) {
        throw new Error("Invalid credentials");
      }
      
      // Retrieve persistent data encryption salt and derive encryption key
      if (!user.dataEncryptionSalt) { // Handle case for old users without salt
        throw new Error("User data encryption salt not found. Please contact support.");
      }
      const dataEncryptionSaltBuffer = Buffer.from(user.dataEncryptionSalt, 'hex');
      const encryptionKey = deriveKey(input.password, dataEncryptionSaltBuffer); // Use persistent salt
      
      const session = await createSession(user.id, encryptionKey); // Pass encryptionKey to createSession
      setSessionCookie(session.token, encryptionKey); // Pass encryptionKey to setSessionCookie
      
      return {
        success: true,
        user: {
          id: user.id,
          email: user.email,
        },
      };
    }),
    
  logout: publicProcedure.mutation(async () => {
    (await cookies()).delete("session_token");
    return {
      success: true,
    };
  }),
});

export type AuthRouter = typeof authRouter;