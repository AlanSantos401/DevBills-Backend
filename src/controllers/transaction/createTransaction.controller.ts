import type { FastifyReply, FastifyRequest } from "fastify"


const createTransaction = async(request: FastifyRequest, reply: FastifyReply): Promise<void> => {
   const userId = "fsfhbhbcb"

   if(!userId){
    reply.status(401).send({error: "Usúario não autenticado"})
   }

}

export default createTransaction