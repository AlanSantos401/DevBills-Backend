import type { TransactionType } from "@prisma/client";
import type { CategorySummary } from "../controllers/category.type";

export interface TransactionFilter {
	userId: string;
	date?: {
		gte: Date;
		lte: Date;
	};
	type?: TransactionType;
	categoryId?: string;
}

export interface TransactionSummary {
	totalExpenses: number;
	totalIncomes: number;
	balance: number;
	expenseCategory: CategorySummary[];
}


