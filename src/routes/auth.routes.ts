import { FastifyInstance } from "fastify";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post("/google", async (request, reply) => {
    try {
      const { idToken } = request.body as { idToken: string };

      if (!idToken) {
        return reply.status(400).send({ error: "idToken é obrigatório" });
      }

      const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload) {
        return reply.status(401).send({ error: "Token inválido" });
      }

      const { sub, email, name, picture } = payload;

      // 🔹 Aqui você pode buscar ou criar usuário no banco

      // 🔐 Gerar JWT próprio da aplicação
      const token = jwt.sign(
        { userId: sub, email },
        process.env.JWT_SECRET as string,
        { expiresIn: "7d" }
      );

      return reply.send({
        token,
        user: {
          googleId: sub,
          email,
          name,
          avatar: picture,
        },
      });
    } catch (error) {
      console.error(error);
      return reply.status(401).send({ error: "Token inválido" });
    }
  });
}
