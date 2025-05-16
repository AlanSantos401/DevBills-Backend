import type { FastifyReply, FastifyRequest } from "fastify";
import { createTransactionSchema } from "../../schemas/transaction.schemas";
import { prisma } from "../../prisma"; // ajuste se o caminho for diferente

const createTransaction = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const userId = "fsfhbhbcb"; // substitua pelo ID real do usuário logado

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	try {
		// 1. Validar o corpo com Zod
		const parsed = createTransactionSchema.parse(request.body);

		// 2. Criar a transação no banco
		const transaction = await prisma.transaction.create({
			data: {
				...parsed,
				userId, // <- insere o userId manualmente
				amount: Number(parsed.amount),
				date: new Date(parsed.date),
			},
			include: {
				category: true, // <- inclui os dados da categoria na resposta
			},
		});

		// 3. Retornar a transação criada
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

