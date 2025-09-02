import { publicProcedure, router } from "../lib/trpc";
import { authRouter } from "./auth";
import { passwordsRouter } from "./passwords";
import { generatorRouter } from "./generator";

export const appRouter = router({
	healthCheck: publicProcedure.query(() => {
		return "OK";
	}),
	auth: authRouter,
	passwords: passwordsRouter,
	generator: generatorRouter,
});

export type AppRouter = typeof appRouter;
