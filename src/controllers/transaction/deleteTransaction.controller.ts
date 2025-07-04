import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { DeleteTransactionParam } from "../../schemas/transaction.schemas";

export const deleteTransaction = async (
	request: FastifyRequest<{ Params: DeleteTransactionParam }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId; 
	const { id } = request.params;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	try {
		const transaction = await prisma.transaction.findFirst({
			where: {
				id,
				userId,
			},
		});

		if (!transaction) {
			reply.status(400).send({ error: "ID da transação inválido" });
			return;
		}

		await prisma.transaction.delete({ where: { id } });

		reply.status(200).send({ message: "Transação deletada com sucesso" });
	} catch (err) {
		request.log.error({ message: "Erro ao deletar transação" });
		reply.status(500).send({ error: "Falha ao deletar a transação" });
	}
};
