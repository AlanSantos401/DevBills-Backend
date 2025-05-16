import type { FastifyInstance } from "fastify";
import categoryRoutes from "./category.routes";
import transactionnRoutes from "./transaction.routes";

async function routes(fastify: FastifyInstance): Promise<void> {
	fastify.get("/health", async () => {
		return {
			status: "Ok",
			message: "DevBills Api funcionando",
		};
	});

	fastify.register(categoryRoutes, { prefix: "/categories" });
	fastify.register(transactionnRoutes, { prefix: "/transactions" });
}

export default routes;
