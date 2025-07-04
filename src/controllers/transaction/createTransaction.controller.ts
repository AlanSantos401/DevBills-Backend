import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schemas";
import { prisma } from "../../config/prisma"; 

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

		
		const transaction = await prisma.transaction.create({
			data: {
				...parsed,
				userId, 
				amount: Number(parsed.amount),
				date: new Date(parsed.date),
			},
			include: {
				category: true, 
			},
		});

		
		reply.status(201).send(transaction);
	} catch (error: unknown) {
	if (error instanceof Error) {
		console.error("Erro:", error.message);
	} else {
		console.error("Erro desconhecido");
	}
}

};

export default createTransaction;

