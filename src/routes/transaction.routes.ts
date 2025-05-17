import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transaction/createTransaction.controller";
import { createTransactionSchema, deleteTransactionSchema, getTransactionSchema, getTransactionsSummarySchema } from "../schemas/transaction.schemas";
import { getTransactions } from "../controllers/transaction/getTransactions.controller";
import { getTransactionnsSummary } from "../controllers/transaction/getTransactionnsSummary.controller";
import { deleteTransaction } from "../controllers/transaction/deleteTransaction.controller";

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

	fastify.route({
		method: "GET",
		url: "/summary",
		schema: {
			querystring: zodToJsonSchema(getTransactionsSummarySchema)
		},
		handler: getTransactionnsSummary,
	})

	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: zodToJsonSchema(deleteTransactionSchema)
		},
		handler: deleteTransaction
	})
};

export default transactionRoutes;
