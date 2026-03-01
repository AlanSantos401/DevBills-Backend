import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schemas";
import { prisma } from "../../config/prisma";
import { addMonths } from "date-fns";

const createTransaction = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	try {
		const parsed = createTransactionSchema.parse(request.body);

		const { installments = 1, ...transactionData } = parsed;

		const transactions = [];

		for (let i = 0; i < installments; i++) {
			const novaData = addMonths(transactionData.date, i);

			const transaction = await prisma.transaction.create({
				data: {
					...transactionData, 
					userId,
					amount: Number(transactionData.amount),
					date: novaData,
				},
				include: {
					category: true,
				},
			});

			transactions.push(transaction);
		}

		reply.status(201).send(transactions);

	} catch (error: unknown) {
		if (error instanceof Error) {
			console.error("Erro:", error.message);
		} else {
			console.error("Erro desconhecido");
		}

		reply.status(400).send({ error: "Erro ao criar transação" });
	}
};

export default createTransaction;