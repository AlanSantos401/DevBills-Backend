import dayjs from "dayjs";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { GetHistoricalTransactionsQuery } from "../../schemas/transaction.schemas";
import "dayjs/locale/pt-br";
import utc from "dayjs/plugin/utc";
import prisma from "../../config/prisma";

dayjs.locale("pt-br");
dayjs.extend(utc);

export const getHistoricalTransactions = async (
	request: FastifyRequest<{ Querystring: GetHistoricalTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ message: "Usuário não autenticado" });
		return;
	}

	const { month, year, months = 6 } = request.query;

	try {
		if (month === 0) {
			const startDate = dayjs
				.utc(new Date(year, 0, 1))
				.startOf("year")
				.toDate();

			const endDate = dayjs
				.utc(new Date(year, 0, 1))
				.endOf("year")
				.toDate();

			const transactions = await prisma.transaction.findMany({
				where: {
					userId,
					date: {
						gte: startDate,
						lte: endDate,
					},
				},
				select: {
					amount: true,
					type: true,
					date: true,
				},
			});

			const monthlyData = Array.from({ length: 12 }, (_, i) => ({
				name: dayjs.utc(new Date(year, i, 1)).format("MMM"),
				income: 0,
				expenses: 0,
			}));

			transactions.forEach((transaction) => {
				const monthIndex = dayjs.utc(transaction.date).month(); 
				const monthData = monthlyData[monthIndex];

				if (transaction.type === "INCOME") {
					monthData.income += transaction.amount;
				} else {
					monthData.expenses += transaction.amount;
				}
			});

			reply.send({ history: monthlyData });
			return;
		}

		const baseDate = new Date(year, month - 1, 1);

		const startDate = dayjs
			.utc(baseDate)
			.subtract(months - 1, "month")
			.startOf("month")
			.toDate();

		const endDate = dayjs.utc(baseDate).endOf("month").toDate();

		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			select: {
				amount: true,
				type: true,
				date: true,
			},
		});

		const monthlyData = Array.from({ length: months }, (_, i) => {
			const date = dayjs
				.utc(baseDate)
				.subtract(months - 1 - i, "month");

			return {
				name: date.format("MMM/YYYY"),
				income: 0,
				expenses: 0,
			};
		});

		transactions.forEach((transaction) => {
			const monthKey = dayjs.utc(transaction.date).format("MMM/YYYY");
			const monthData = monthlyData.find((m) => m.name === monthKey);

			if (monthData) {
				if (transaction.type === "INCOME") {
					monthData.income += transaction.amount;
				} else {
					monthData.expenses += transaction.amount;
				}
			}
		});

		reply.send({ history: monthlyData });

	} catch (err) {
		reply.status(500).send({ message: "Erro ao buscar histórico" });
	}
};
