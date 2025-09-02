import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../lib/trpc";
import { 
  createPassword, 
  getPasswords, 
  getPasswordById, 
  updatePassword, 
  deletePassword,
  decryptPassword
} from "../lib/passwords";
import { getUserByEmail } from "../lib/auth";

export const passwordsRouter = router({
  create: protectedProcedure
    .input(
      z.object({
        website: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.encryptionKey) { // Ensure encryptionKey is available
        throw new Error("Encryption key not found in session.");
      }
      const password = await createPassword(
        ctx.session.userId,
        input.website,
        input.username,
        input.password,
        ctx.session.encryptionKey, // Pass encryptionKey from context
        input.category
      );
      
      return {
        success: true,
        password,
      };
    }),
    
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const passwords = await getPasswords(ctx.session.userId);
      return passwords;
    }),
    
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const password = await getPasswordById(input.id, ctx.session.userId);
      if (!password) {
        throw new Error("Password not found");
      }
      
      return password;
    }),
    
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        website: z.string().min(1),
        username: z.string().min(1),
        password: z.string().min(1),
        category: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.session?.encryptionKey) { // Ensure encryptionKey is available
        throw new Error("Encryption key not found in session.");
      }
      const password = await updatePassword(
        input.id,
        ctx.session.userId,
        input.website,
        input.username,
        input.password,
        ctx.session.encryptionKey, // Pass encryptionKey from context
        input.category
      );
      
      return {
        success: true,
        password,
      };
    }),
    
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await deletePassword(input.id, ctx.session.userId);
      
      return {
        success: true,
      };
    }),
    
  decrypt: protectedProcedure // Changed to protectedProcedure
    .input(
      z.object({
        encryptedPassword: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => { // Added ctx
      if (!ctx.session?.encryptionKey) { // Ensure encryptionKey is available
        throw new Error("Encryption key not found in session.");
      }
      try {
        const decrypted = decryptPassword(input.encryptedPassword, ctx.session.encryptionKey); // Use encryptionKey from context
        return {
          success: true,
          decryptedPassword: decrypted,
        };
      } catch (error) {
        throw new Error("Failed to decrypt password");
      }
    }),
});

export type PasswordsRouter = typeof passwordsRouter;