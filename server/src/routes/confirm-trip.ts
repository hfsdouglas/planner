import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from 'zod';
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { prisma } from "../lib/prisma";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function confirmTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().get('/trips/:tripId/confirmation', {
        schema: {
            params: z.object({
                tripId: z.string().uuid(),
            })
        }
    }, async (request, reply) => {
        const { tripId } = request.params
        
        const trip = await prisma.trip.findUnique({
            where: {
                id: tripId,
            },
            include: {
                participants: {
                    where: {
                        is_owner: false,
                    }
                }
            }
        })

        if (!trip) {
            throw new ClientError('Trip not found');
        }

        if(trip.is_confirmed) {
            return reply.redirect(`${env.WEB_BASE_URL}/trips/${trip.id}`)
        }

        await prisma.trip.update({
            where: { id: tripId },
            data: { is_confirmed: true }
        })

        const formatedStartDate = dayjs(trip.starts_at).format('LL')
        const formatedEndDate = dayjs(trip.ends_at).format('LL')
        
        const mail = await getMailClient()
        
        await Promise.all(
            trip.participants.map(async (participant) => {
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
            })
        )

        return reply.redirect(`${env.WEB_BASE_URL}/trips/${trip.id}`) 
    })
}