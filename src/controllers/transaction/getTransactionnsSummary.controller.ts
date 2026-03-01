import { TransactionType } from "@prisma/client";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import type { FastifyReply, FastifyRequest } from "fastify";
import prisma from "../../config/prisma";
import type { GetTransactionsQuery } from "../../schemas/transaction.schemas";
import type { CategorySummary } from "../category.type";
import type { TransactionSummary } from "../../type/transaction.types";

dayjs.extend(utc);

export const getTransactionnsSummary = async (
	request: FastifyRequest<{ Querystring: GetTransactionsQuery }>,
	reply: FastifyReply,
): Promise<void> => {
	const userId = request.userId;

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const month = Number(request.query.month);
const year = Number(request.query.year);

	if (year === undefined || month === undefined) {
		reply.status(400).send({ error: "Mês e Ano são obrigatórios" });
		return;
	}

	let startDate: Date;
	let endDate: Date;

	if (month === 0) {
		startDate = dayjs.utc(`${year}-01-01`).startOf("year").toDate();
		endDate = dayjs.utc(startDate).endOf("year").toDate();
	} 

	else {
		startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
		endDate = dayjs.utc(startDate).endOf("month").toDate();
	}

	try {
		const transactions = await prisma.transaction.findMany({
			where: {
				userId,
				date: {
					gte: startDate,
					lte: endDate,
				},
			},
			include: {
				category: true,
			},
		});

		let totalExpenses = 0;
		let totalIncomes = 0;

		const groupExpenses = new Map<string, CategorySummary>();

		for (const transaction of transactions) {
			if (transaction.type === TransactionType.EXPENSE) {
				const existing = groupExpenses.get(transaction.categoryId) ?? {
					categoryId: transaction.categoryId,
					categoryName: transaction.category.name,
					categoryColor: transaction.category.color,
					amount: 0,
					porcentage: 0,
				};

				existing.amount += transaction.amount;
				groupExpenses.set(transaction.categoryId, existing);

				totalExpenses += transaction.amount;
			} else {
				totalIncomes += transaction.amount;
			}
		}

		const summary: TransactionSummary = {
			totalExpenses,
			totalIncomes,
			balance: totalIncomes - totalExpenses, // ✅ corrigido
			expenseCategory: Array.from(groupExpenses.values())
				.map((entry) => ({
					...entry,
					porcentage:
						totalExpenses > 0
							? Number(
									((entry.amount / totalExpenses) * 100).toFixed(2),
							  )
							: 0,
				}))
				.sort((a, b) => b.amount - a.amount),
		};

		reply.send(summary);
	} catch (err) {
		request.log.error("Erro ao trazer transações", err);
		reply.status(500).send({ error: "Erro do servidor" });
	}
};