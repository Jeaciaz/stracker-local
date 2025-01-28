import {z} from 'zod'
import {Category} from './category'

export const Spending = z.object({
  id: z.string(),
  username: z.string(),
  timestamp: z.number(),
  amount: z.number(),
  category: Category,
})

export type Spending = z.infer<typeof Spending>

export const SpendingCreate = Spending.omit({id: true}).extend({
  // exists for already created spendings when retrofitting the add events
  id: z.string().optional(),
})

export type SpendingCreate = z.infer<typeof SpendingCreate>
