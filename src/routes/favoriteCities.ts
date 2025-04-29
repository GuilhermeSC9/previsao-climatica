import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function favoriteCitiesRoutes(app: FastifyInstance) {
    //Adicionar cidades aos favoritos
    app.post('/favorite-city', async (request, reply) =>{
        const createFavoriteCityBodySchema = z.object({
            name: z.string().min(3),
        })

        const { name } = createFavoriteCityBodySchema.parse(request.body)

        const favoriteCity = await prisma.favoriteCity.findFirst({
            where: {
                name
            }
        })

        if (favoriteCity){
            return reply.status(409).send("Essa cidade já foi adicionada")
            
            
        } else{
            await prisma.favoriteCity.create({
                data: {
                    name
                }
            })
            return reply.status(201).send("Cidade adicionada com sucesso!")
        }

    })
    //Remover cidades dos favoritos
    app.delete('/favorite-city/:id', async(request, reply) =>{
        const deleteFavoriteCityParamsSchema = z.object({
            id: z.coerce.number(),
        })

        const { id } = deleteFavoriteCityParamsSchema.parse(request.params)


        const favoriteCity = await prisma.favoriteCity.delete({
            where: {
                id
            }
        })

        if(!favoriteCity){
            return reply.status(404).send('Cidade não encontrada')
            
        } else {
            return reply.status(204).send()
        }
    })
    //Buscar cidades favoritas
    app.get("/favorite-city", async(request, reply) =>{
        const favoriteCities = await prisma.favoriteCity.findMany({})

        return reply.send({
            favoriteCities
        })
    })
}