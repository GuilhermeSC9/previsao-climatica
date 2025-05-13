import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function favoriteCitiesRoutes(app: FastifyInstance) {
    //Adicionar cidades aos favoritos
    app.post('/favoritecity', async (request, reply) =>{
        const createFavoriteCityBodySchema = z.object({
            name: z.string().min(3),
        })

        const { name } = createFavoriteCityBodySchema.parse(request.body)

        const insertedCity = await prisma.favoriteCity.findFirst({
            where: {
                name
            }
        })

        if (insertedCity){
            return reply.status(409).send("Essa cidade já foi adicionada")
            
            
        } else{
            await prisma.favoriteCity.create({
                data: {
                    name: name
                }
            })
            return reply.status(201).send("Cidade adicionada com sucesso!")
        }

    })
    //Remover cidades dos favoritos
    app.delete('/favoritecity/:id', async(request, reply) =>{
        const deleteFavoriteCityParamsSchema = z.object({
            id: z.coerce.number(),
        })

        const { id } = deleteFavoriteCityParamsSchema.parse(request.params)


        const insertedCity = await prisma.favoriteCity.findUnique({
            where: {
                id
            }
        })

        if(!insertedCity){
            return reply.status(404).send('Cidade não encontrada')
            
        }

        await prisma.favoriteCity.delete({
            where: {
                id
            }
        })
        return reply.status(204).send("Cidade removida")
    })
    //Buscar cidades favoritas
    app.get("/favoritecity", async(request, reply) =>{
        const favoriteCities = await prisma.favoriteCity.findMany({})

        return reply.send({
            favoriteCities
        })
    })
}