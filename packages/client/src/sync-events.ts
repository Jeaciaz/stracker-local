import { createLocalSignal, timestampPredicate } from './utils'
import { Event, EventCreate, trpcClient } from './trpc'
import { spendings } from './spendings'

const [lastSyncTs, setLastSyncTs] = createLocalSignal<number | null>(
  'sync-last-ts',
  null,
)
const [syncCredentials, setSyncCredentials] = createLocalSignal<{
  username: string
  password: string
} | null>('sync-credentials', null)
const [syncEvents, setSyncEvents] = createLocalSignal<(Event | EventCreate)[]>(
  'unsynced-events',
  [],
)
export const isSyncEnabled = () => syncCredentials() !== null

export { syncCredentials, syncEvents }

export const insertEvent = (event: EventCreate) =>
  setSyncEvents(arr => [...arr, event].sort(timestampPredicate))

export const enableSync = async () => {
  if (isSyncEnabled()) return

  const password = prompt('Please enter the password to access sync')
  if (!password) return
  const hasAccess = await trpcClient.events.checkSyncAccess.query(password)
  if (!hasAccess) alert('Incorrect password!')
  const username = prompt(
    'Password correct! Please enter the username you want to take',
  )
  if (!username) return
  setSyncCredentials({ username, password })
  await initialSync()
}

const initialSync = async () => {
  const credentials = syncCredentials()

  if (!credentials) {
    alert('You need to confirm sync with password first')
    return
  }
  const events = spendings().map(
    spending =>
      ({
        type: 'AddSpending',
        timestamp: Date.now(),
        eventData: { ...spending, username: credentials.username },
      }) satisfies EventCreate,
  )

  setSyncEvents(events)
  await performSync()
}

export const performSync = async () => {
  const unsyncedEvents = syncEvents().filter(event => event.timestamp > (lastSyncTs() ?? 0))
  const events = await trpcClient.events.getEvents
    .query({
      timestampFrom: lastSyncTs() ?? undefined,
    })
    .then(arr => arr.sort((a, b) => b.timestamp - a.timestamp))

  setSyncEvents(existingEvents =>
    existingEvents.concat(
      events.filter(
        remoteEvent =>
          !existingEvents.some(
            existingEvent =>
              'id' in existingEvent && existingEvent.id === remoteEvent.id,
          ),
      ),
    ).toSorted(timestampPredicate),
  )

  setLastSyncTs(Date.now())
  await trpcClient.events.createEvents.mutate(unsyncedEvents)
}
