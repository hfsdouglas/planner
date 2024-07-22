import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import { string, z } from 'zod';
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";

export async function getParticipant(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/participant/:participantId', {
        schema: {
            params: z.object({
                participantId: string().uuid(),
            }),
        }
    }, 
    async (request) => {
        const { participantId } = request.params

        const participant = await prisma.participant.findUnique({
            select: {
                id: true,
                name: true,
                email: true,
                is_confirmed: true,
            },
            where: {
                id: participantId,
            },
        })

        if (!participant) {
            throw new ClientError('Trip not found')
        }

        return { participant }
    })
}