import {z} from 'zod'
import {protectedProcedure, publicProcedure, router} from '../trpc'
import {EventCreate, EventFilters} from '../model/event'
import {eventRepo} from '../repo/event'

export const eventRouter = router({
  getEvents: protectedProcedure.input(EventFilters).query(({input}) => {
    return eventRepo.getList(input)
  }),
  createEvents: protectedProcedure
    .input(z.array(EventCreate))
    .mutation(({input}) => {
      return eventRepo.createMultiple(input)
    }),
  checkSyncAccess: publicProcedure
    .input(z.string())
    .query(({input}) => input === Bun.env.SYNC_PASSKEY),
})
