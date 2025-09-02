import { z } from "zod";
import { publicProcedure, router } from "../lib/trpc";
import { generatePassword } from "../lib/passwordGenerator";

export const generatorRouter = router({
  generate: publicProcedure
    .input(
      z.object({
        length: z.number().min(4).max(128).default(16),
      })
    )
    .mutation(({ input }) => {
      const password = generatePassword(input.length);
      return {
        success: true,
        password,
      };
    }),
});

export type GeneratorRouter = typeof generatorRouter;