
import { env } from "./config/env";
import app from "./app";
import { prismaConnect } from "./config/prisma";
import { initalizeGlobalCategory } from "./services/globalCategories.service";


const PORT = env.PORT;

const startServer = async () => {
	try {
		await prismaConnect();

		await initalizeGlobalCategory();

		await app.listen({ port: PORT }).then(() => {
			console.log(`Servidor rodando na porta ${PORT}`);
		});
	} catch (err) {
		console.error(err);
	}
};

startServer();
