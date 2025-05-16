import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsQuery } from "../../schemas/transaction.schemas";
import type { TransactionFilter } from "../../type/transaction.types";

dayjs.extend(utc);

export const getTransactions = async (
	request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = "fsfhbhbcb";

	if (!userId) {
		reply.status(401).send({ error: "Usúario não autenticado" });
	}

	const { month, categoryId, year, type } = request.query;

	const filters: TransactionFilter = { userId };

	if (month && year) {
		const startDate = dayjs
			.utc(`${year}-${month}-01`)
			.startOf("month")
			.toDate();
		const endDate = dayjs.utc(startDate).endOf("month").toDate();
		filters.date = { gte: startDate, lte: endDate };
	}

	if (type) {
		filters.type = type;
	}

	if (categoryId) {
		filters.categoryId = categoryId;
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: filters,
			orderBy: { date: "desc" },
			include: {
				category: {
					select: {
						color: true,
						name: true,
						type: true,
					},
				},
			},
		});

		reply.send(transactions);
	} catch (err) {
		request.log.error("Error ao trazer transações", err);
		reply.status(500).send({ error: "Erro do servidor" });
	}
};
