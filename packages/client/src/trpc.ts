import {createTRPCProxyClient, httpBatchLink} from '@trpc/client'
import type {AppRouter} from '@server'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
    }),
  ],
})

// TODO there is probably a better way to share types, but for now this will do
export type Event = Awaited<
  ReturnType<typeof trpcClient.events.getEvents.query>
>[number]

export type EventCreate = Awaited<
  Parameters<typeof trpcClient.events.createEvents.mutate>[0]
>[number]

export type Spending = Awaited<
  ReturnType<typeof trpcClient.spendings.getList.query>
>[number]

export type SpendingCreate = Omit<Awaited<
  Parameters<typeof trpcClient.spendings.uploadSpendings.mutate>[0]
>[number], 'username'>
