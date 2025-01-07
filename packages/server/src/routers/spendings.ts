import {z} from 'zod'
import {publicProcedure, router} from '../trpc'
import {turso} from '../db'
import {Spending, SpendingCreate} from '../model/spending'
import {spendingRepo} from '../repo/spending'

export const spendingRouter = router({
  getList: publicProcedure
    .input(z.object({timestampFrom: z.number()}).optional())
    .query(({input}) => {
      return spendingRepo.getList(input)
    }),
  uploadSpendings: publicProcedure
    .input(spendings => {
      if (!Array.isArray(spendings)) throw new Error('Must be an array')
      return spendings.filter(
        (item): item is SpendingCreate => SpendingCreate.safeParse(item).success,
      )
    })
    .mutation(async ({input}) => {
      // const timestamps = await turso.execute('SELECT timestamp FROM spendings')
      // const existingtimestamps = z
      //   .array(Spending.pick({timestamp: true}))
      //   .parse(timestamps.rows)
      //   .reduce((acc, {timestamp}) => {
      //     acc.add(timestamp)
      //     return acc
      //   }, new Set<number>())
      // const spendingsToInsert = input.filter(
      //   spending => !existingtimestamps.has(spending.timestamp),
      // )
      // if (!spendingsToInsert.length) {
      //   return
      // }
      //
      // // TODO really should use a repo pattern
      // const values = spendingsToInsert.map(() => '(?, ?, ?, ?)').join(', ')
      // const bindings = spendingsToInsert.flatMap(spending => [
      //   spending.username,
      //   spending.timestamp,
      //   spending.amount,
      //   spending.category,
      // ])
      // await turso.execute({
      //   sql: `INSERT INTO spendings (username, timestamp, amount, category) VALUES ${values}`,
      //   args: bindings,
      // })
    }),
})
