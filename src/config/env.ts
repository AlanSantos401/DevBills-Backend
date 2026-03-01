import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().transform(Number).default("3001"),
	DATABASE_URL: z.string().min(5, "DATABASE_URL é obrigatório"),

	NODE_ENV: z.enum(["dev", "test", "prod"], {
		message: "O NODE_ENV deve ser dev, test ou prod",
	}),

	JWT_SECRET: z.string().min(10, "JWT_SECRET é obrigatório"),

	GOOGLE_CLIENT_ID: z.string().min(10, "GOOGLE_CLIENT_ID é obrigatório"),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error("🚨 Variáveis de ambiente inválidas");
	console.error(_env.error.format());
	process.exit(1);
}

export const env = _env.data;
