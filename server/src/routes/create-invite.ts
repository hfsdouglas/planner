import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from 'zod';
import { dayjs } from "../lib/dayjs";
import { getMailClient } from "../lib/mail";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createInvite(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips/:tripId/invites', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            }),
            body: z.object({
                email: z.string().email(),
            })
        }
    }, 
    async (request) => {
        const { tripId } = request.params
        const { email } = request.body

        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId,
            }
        })

        if (!trip) {
            throw new ClientError('Trip not found')
        }

        const participant = await prisma.participant.create({
            data: {
                email,
                trip_id: tripId,
            }
        })

        const formatedStartDate = dayjs(trip.starts_at).format('LL')
        const formatedEndDate = dayjs(trip.ends_at).format('LL')
        
        const mail = await getMailClient()
        
        const confirmationLink = `${env.API_BASE_URL}/participants/${participant.id}/confirm`
        
        const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'noreply@plann.er',
            },
            to: participant.email,
            subject: `Confirme sua presença na viagem para ${trip.destination} em ${formatedStartDate}`,
            html: `
                <div>
                    <p>Você foi convidado para participar de uma viagem para <strong>${trip.destination}</strong> nas datas de <strong>${formatedStartDate}</strong> até <strong>${formatedEndDate}.</strong></p>
                    <br>
                    <p>Para confirmar sua presença, clique no link abaixo:</p>
                    <br>
                    <p><a href="${confirmationLink}">Confirmar viagem</a></p>
                    <br>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore.</p>
                </div>
            `.trim(),
        })

        console.log(nodemailer.getTestMessageUrl(message))

        return { participantId: participant.id }
    })
}