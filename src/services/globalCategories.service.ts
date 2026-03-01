import { type Category, TransactionType } from "@prisma/client";
import prisma from "../config/prisma";

type GlobalCategoryInput = Pick<Category, "name" | "color" | "type">;

const globalCategories: GlobalCategoryInput[] = [
	// Despesas
{ name: "Açougue", color: "#6288cf", type: TransactionType.EXPENSE },
{ name: "Alimentação", color: "#FF5733", type: TransactionType.EXPENSE },
{ name: "Transporte", color: "#33A8FF", type: TransactionType.EXPENSE },
{ name: "Moradia", color: "#33FF57", type: TransactionType.EXPENSE },
{ name: "Contas da Casa", color: "#FFA07A", type: TransactionType.EXPENSE },  
{ name: "Saúde", color: "#F033FF", type: TransactionType.EXPENSE },
{ name: "Educação", color: "#FF3366", type: TransactionType.EXPENSE },
{ name: "Lazer", color: "#FFBA33", type: TransactionType.EXPENSE },
{ name: "Compras", color: "#33FFF6", type: TransactionType.EXPENSE },
{ name: "Cuidados Pessoais", color: "#C71585", type: TransactionType.EXPENSE }, 
{ name: "Bebê - Alimentação", color: "#FFD1DC", type: TransactionType.EXPENSE },
{ name: "Bebê - Higiene", color: "#ADD8E6", type: TransactionType.EXPENSE }, 
{ name: "Outros", color: "#686868", type: TransactionType.EXPENSE },

	// Receitas
	{ name: "Salário", color: "#33FF57", type: TransactionType.INCOME },
	{ name: "Freelance", color: "#33A8FF", type: TransactionType.INCOME },
	{ name: "Investimentos", color: "#a03a2c", type: TransactionType.INCOME }, 
	{ name: "Bolsa Família", color: "#FFD700", type: TransactionType.INCOME }, 
	{ name: "Outros", color: "#686868", type: TransactionType.INCOME },
];

export const initalizeGlobalCategory = async (): Promise<Category[]> => {
	const createdCategories: Category[] = [];

	for (const Category of globalCategories) {
		try {
			const existing = await prisma.category.findFirst({
				where: {
					name: Category.name,
					type: Category.type,
				},
			});

			if (!existing) {
				const newCategory = await prisma.category.create({ data: Category });
				console.log(`✅ Criada ${newCategory.name}`);
				createdCategories.push(newCategory);
			} else {
				createdCategories.push(existing);
			}
		} catch (err) {
			console.error("🚨 Error ao criar categorias");
		}
	}

	console.log("🚀👌 Todas categorias inicializadas");

	return createdCategories;
};
