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
	const userId = "fsfhbhbcb";

	if (!userId) {
		reply.status(401).send({ error: "Usuário não autenticado" });
		return;
	}

	const { month, year } = request.query;

	if (!month || !year) {
		reply.status(400).send({ error: "Mês e Ano são obrigatórios" });
		return;
	}

	const startDate = dayjs.utc(`${year}-${month}-01`).startOf("month").toDate();
	const endDate = dayjs.utc(startDate).endOf("month").toDate();

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
		const groupeExpenses = new Map<string, CategorySummary>();

		for (const transaction of transactions) {
			if (transaction.type === TransactionType.expense) {
				const existing = groupeExpenses.get(transaction.categoryId) ?? {
					categoryId: transaction.categoryId,
					categoryName: transaction.category.name,
					categoryColor: transaction.category.color,
					amount: 0,
					porcentage: 0,
				};

				existing.amount += transaction.amount;
				groupeExpenses.set(transaction.categoryId, existing);

				totalExpenses += transaction.amount;
			} else {
				totalIncomes += transaction.amount;
			}
		}
		
        console.log(Array.from(groupeExpenses.values()))
        const summary: TransactionSummary = {
          totalExpenses,
          totalIncomes,
          balance: Number((totalIncomes - totalExpenses).toExponential(2)),
          expenseCategory: Array.from(groupeExpenses.values()).map( (entry) => ({
            ...entry,
            porcentage: Number.parseFloat(((entry.amount / totalExpenses) * 100).toFixed(2)),
          })).sort((a,b) => b.amount - a.amount )
        }
		reply.send(summary);
	} catch (err) {
		request.log.error("Error ao trazer transações", err);
		reply.status(500).send({ error: "Erro do servidor" });
	}
};
