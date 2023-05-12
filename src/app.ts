import fastify from 'fastify'
import { appRoutes } from './http/routes'
import { ZodError } from 'zod'
import { env } from './env'
export const app = fastify()
app.register(appRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'validation error', issues: error.format() })
  }
  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // todo: log para ferramenta externa
  }
  return reply.status(500).send({ message: 'internal server error' })
})
