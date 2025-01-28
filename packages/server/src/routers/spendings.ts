import {z} from 'zod'
import {protectedProcedure, router} from '../trpc'
import {spendingRepo} from '../repo/spending'

export const spendingRouter = router({
  getList: protectedProcedure
    .input(z.object({timestampFrom: z.number()}).optional())
    .query(({input}) => {
      return spendingRepo.getList(input)
    }),
})
