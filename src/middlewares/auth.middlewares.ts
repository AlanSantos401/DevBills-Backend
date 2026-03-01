import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

declare module "fastify" {
	interface FastifyRequest {
		userId?: string;
	}
}

export const authMiddleware = async (
	request: FastifyRequest,
	reply: FastifyReply,
): Promise<void> => {
	const authHeader = request.headers.authorization;

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		reply.code(401).send({ error: "Token não fornecido" });
		return;
	}

	const token = authHeader.replace("Bearer ", "");

	try {
		const decoded = jwt.verify(token, env.JWT_SECRET) as {
			userId: string;
			email: string;
		};

		request.userId = decoded.userId;

	} catch (err) {
		request.log.error("Erro ao verificar token", err);
		reply.code(401).send({ error: "Token inválido ou expirado" });
	}
};
