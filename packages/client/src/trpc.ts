import {createTRPCProxyClient, httpBatchLink} from '@trpc/client'
import type {AppRouter} from '@server'
import {syncCredentials} from './sync-events'

export const trpcClient = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: import.meta.env.VITE_BACKEND_URL,
      headers: () => ({Authorization: syncCredentials()?.password}),
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

export type LocalSpending = Omit<Spending, 'username' | 'id'>

export type SpendingCreate = Omit<Spending, 'id'> & {id?: string}
