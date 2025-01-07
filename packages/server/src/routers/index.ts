import {spendingRouter} from '../routers/spendings'
import {router} from '../trpc'
import {eventRouter} from './events'

export const appRouter = router({
  spendings: spendingRouter,
  events: eventRouter,
})

export type AppRouter = typeof appRouter
