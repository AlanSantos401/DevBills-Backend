import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transaction/createTransaction.controller";
import { createTransactionSchema, getTransactionSchema } from "../schemas/transaction.schemas";
import { getTransactions } from "../controllers/transaction/getTransactions.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {
	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: zodToJsonSchema(createTransactionSchema),
		},
		handler: createTransaction,
	});

	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: zodToJsonSchema(getTransactionSchema)
		},
		handler: getTransactions,
	})
};

export default transactionRoutes;
