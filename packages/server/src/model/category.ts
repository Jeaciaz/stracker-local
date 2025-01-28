import {z} from 'zod'

export const Category = z.union([
  z.literal('groceries'),
  z.literal('subscriptions'),
  z.literal('medical'),
  z.literal('entertainment'),
  z.literal('clothing'),
  z.literal('cosmetics'),
  z.literal('home'),
  z.literal('coffee'),
  z.literal('misc'),
])

export type Category = z.infer<typeof Category>
