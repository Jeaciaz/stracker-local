import {fastifyTRPCPlugin} from '@trpc/server/adapters/fastify'
import fastify from 'fastify'
import {appRouter} from './routers'
import { createContext } from './trpc'
import fastifyCors from '@fastify/cors'
import { env } from 'bun'

export type ServerOptions = {
  dev?: boolean
  port?: number
  prefix?: string
}

export function createServer({
  dev = true,
  port = 3001,
  prefix = '/trpc',
}: ServerOptions) {
  const server = fastify({logger: dev})

  server.register(fastifyTRPCPlugin, {
    prefix,
    trpcOptions: {router: appRouter, createContext},
  })

  server.register(fastifyCors, {
    origin: [env.FRONTEND_ORIGIN],
    methods: ['GET', 'POST'],
    credentials: true,
  })

  const stop = () => server.close()

  const start = async () => {
    try {
      await server.listen({port, host: "0.0.0.0"})
      console.log(`Server listening on 0.0.0.0:${port}`)
    } catch (e) {
      server.log.error(e)
      process.exit(1)
    }
  }

  return {server, start, stop}
}
