import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import nodemailer from "nodemailer";
import { z } from 'zod';
import { prisma } from "../lib/prisma";
import { getMailClient } from "../lib/mail";
import { dayjs } from "../lib/dayjs";
import { ClientError } from "../errors/client-error";
import { env } from "../env";

export async function createTrip(app: FastifyInstance) {
    app.withTypeProvider<ZodTypeProvider>().post('/trips', {
        schema: {
            body: z.object({
                destination: z.string().min(4),
                starts_at: z.coerce.date(),
                ends_at: z.coerce.date(),
                owner_name: z.string(),
                owner_email: z.string().email(),
                emails_to_invite: z.array(z.string().email())
            })
        }
    }, async (request) => {
        const { destination, starts_at, ends_at, owner_name, owner_email, emails_to_invite } = request.body
        
        if (dayjs(starts_at).isBefore(new Date())) {
            throw new ClientError('Invalid trip start date.')
        }

        if (dayjs(ends_at).isBefore(starts_at)) {
            throw new ClientError('Invalid trip end date.')
        }

        const trip = await prisma.trip.create({
            data: {
                destination,
                starts_at,
                ends_at,
                participants: {
                    createMany: {
                        data: [
                            {
                                name: owner_name,
                                email: owner_email,
                                is_owner: true,
                                is_confirmed: true,
                            }, 
                            ...emails_to_invite.map((email) => {
                                return { email }
                            })
                        ]
                    }
                }
            }
        })

        const formatedStartDate = dayjs(starts_at).format('LL')
        const formatedEndDate = dayjs(ends_at).format('LL')

        const confirmationLink = `${env.API_BASE_URL}/trips/${trip.id}/confirmation`

        const mail = await getMailClient()

        const message = await mail.sendMail({
            from: {
                name: 'Equipe plann.er',
                address: 'noreply@plann.er',
            },
            to: {
                name: owner_name,
                address: owner_email,
            },
            subject: `Confirme sua viagem para ${destination} em ${formatedStartDate}`,
            html: `
                <div>
                    <p>Você solicitou a criação de uma viagem para <strong>${destination}</strong> nas datas de <strong>${formatedStartDate}</strong> até <strong>${formatedEndDate}.</strong></p>
                    <br>
                    <p>Para confirmar sua viagem, clique no link abaixo:</p>
                    <br>
                    <p><a href="${confirmationLink}">Confirmar viagem</a></p>
                    <br>
                    <p>Caso você não saiba do que se trata esse e-mail, apenas ignore.</p>
                </div>
            `,
        })

        console.log(nodemailer.getTestMessageUrl(message))

        return { tripId: trip.id }
    })
}