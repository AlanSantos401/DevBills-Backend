import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
	PORT: z.string().transform(Number).default("3001"),
	DATABASE_URL: z.string().min(5, "DATABASE_URL é obriggatório"),
	NODE_ENV: z.enum(["dev", "test", "prod"], {
      message: "O Node ENV deve ser env, test, prod",
    }),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
	console.error(" 🚨Variaveis de ambiente INVÁLIDAS");
	process.exit(1);
}

export const env = _env.data;
