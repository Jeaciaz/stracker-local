import {z} from 'zod'
import {publicProcedure, router} from '../trpc'
import {EventCreate, EventFilters} from '../model/event'
import {eventRepo} from '../repo/event'

export const eventRouter = router({
  getEvents: publicProcedure.input(EventFilters).query(() => {
    return eventRepo.getList()
  }),
  createEvents: publicProcedure
    .input(z.array(EventCreate))
    .mutation(({input}) => {
      return eventRepo.createMultiple(input)
    }),
  checkSyncAccess: publicProcedure
    .input(z.string())
    .query(({input}) => input === Bun.env.SYNC_PASSKEY),
})
