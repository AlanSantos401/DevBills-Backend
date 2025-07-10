import type { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import createTransaction from "../controllers/transaction/createTransaction.controller";
import { deleteTransaction } from "../controllers/transaction/deleteTransaction.controller";
import { getTransactionnsSummary } from "../controllers/transaction/getTransactionnsSummary.controller";
import { getTransactions } from "../controllers/transaction/getTransactions.controller";
import { authMiddleware } from "../middlewares/auth.middlewares";
import {
	createTransactionSchema,
	deleteTransactionSchema,
	getHistoricalTransactionsSchema,
	getTransactionSchema,
	getTransactionsSummarySchema,
} from "../schemas/transaction.schemas";
import { getHistoricalTransactions } from "../controllers/transaction/getHistoricalTransaction.controller";

const transactionRoutes = async (fastify: FastifyInstance) => {
	fastify.addHook("preHandler", authMiddleware);

	// Criacao de uma nova transacao
	fastify.route({
		method: "POST",
		url: "/",
		schema: {
			body: zodToJsonSchema(createTransactionSchema),
		},
		handler: createTransaction,
	});

	// Buscar com Filtros
	fastify.route({
		method: "GET",
		url: "/",
		schema: {
			querystring: zodToJsonSchema(getTransactionSchema),
		},
		handler: getTransactions,
	});

	// Buscar resumo das transacoes
	fastify.route({
		method: "GET",
		url: "/summary",
		schema: {
			querystring: zodToJsonSchema(getTransactionsSummarySchema),
		},
		handler: getTransactionnsSummary,
	});

	// Historico de transacoes
	fastify.route({
		method: "GET",
		url: "/historical",
		schema: {
			querystring: zodToJsonSchema(getHistoricalTransactionsSchema),
		},
		handler: getHistoricalTransactions,
	});

	// Deletar uma transacao
	fastify.route({
		method: "DELETE",
		url: "/:id",
		schema: {
			params: zodToJsonSchema(deleteTransactionSchema),
		},
		handler: deleteTransaction,
	});
};

export default transactionRoutes;
