import {initTRPC, TRPCError} from '@trpc/server'
import type {CreateFastifyContextOptions} from '@trpc/server/adapters/fastify'
import {env} from 'bun'

export const createContext = ({req, res}: CreateFastifyContextOptions) => {
  const authHeader = req.headers.authorization
  return {isAuthed: authHeader === env.SYNC_PASSKEY, req, res}
}

type Context = ReturnType<typeof createContext>

const t = initTRPC.context<Context>().create()

export const router = t.router
export const publicProcedure = t.procedure

export const protectedProcedure = t.procedure.use(
  function hasCorrectPassword(opts) {
    if (!opts.ctx.isAuthed) {
      throw new TRPCError({code: 'UNAUTHORIZED'})
    }
    return opts.next()
  },
)
