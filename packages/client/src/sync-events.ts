import {createLocalSignal, timestampPredicate} from './utils'
import {Event, EventCreate, trpcClient} from './trpc'
import {spendings} from './spendings/spendings'
import {createSignal} from 'solid-js'
import {localSpendings} from './spendings/local'

const [lastSyncTs, setLastSyncTs] = createLocalSignal<number | null>(
  'sync-last-ts',
  null,
)

export type Credentials = {username: string; password: string}
const [syncCredentials, setSyncCredentials] =
  createLocalSignal<Credentials | null>('sync-credentials', null)
const [syncEvents, setSyncEvents] = createLocalSignal<(Event | EventCreate)[]>(
  'unsynced-events',
  [],
)
export const isSyncEnabled = () => syncCredentials() !== null

export {syncCredentials, syncEvents}

export const insertEvent = (event: EventCreate) => {
  setSyncEvents(arr => [...arr, event].sort(timestampPredicate))
  performSync()
}

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
  setSyncCredentials({username, password})
  await initialSync()
}

const initialSync = async () => {
  const credentials = syncCredentials()

  if (!credentials) {
    alert('You need to confirm sync with password first')
    return
  }
  const events = localSpendings().map(
    spending =>
      ({
        type: 'AddSpending',
        timestamp: spending.timestamp,
        eventData: {...spending, username: credentials.username},
      }) satisfies EventCreate,
  )

  setSyncEvents(events)
  await sendUnsyncedEvents()
  setSyncEvents([])
  await performSync()
}

export const [isSyncing, setIsSyncing] = createSignal(false)

const sendUnsyncedEvents = () => {
  const unsyncedEvents = syncEvents().filter(
    event => event.timestamp > (lastSyncTs() ?? 0),
  )
  if (unsyncedEvents.length === 0) {
    return Promise.resolve()
  }
  return trpcClient.events.createEvents.mutate(unsyncedEvents)
}

const getEventsFromSync = () => {
  return trpcClient.events.getEvents
    .query({
      timestampFrom: lastSyncTs() ?? undefined,
    })
    .then(arr => arr.sort(timestampPredicate))
}

export const performSync = async () => {
  if (!isSyncEnabled()) return
  setIsSyncing(true)
  try {
    const events = await getEventsFromSync()
    await sendUnsyncedEvents()
    setSyncEvents(existingEvents =>
      existingEvents
        .concat(
          events.filter(
            remoteEvent =>
              !existingEvents.some(
                existingEvent =>
                  'id' in existingEvent && existingEvent.id === remoteEvent.id,
              ),
          ),
        )
        .toSorted(timestampPredicate),
    )

    setLastSyncTs(Date.now())
  } catch (e) {
    alert(e instanceof Error ? e : JSON.stringify(e))
  } finally {
    setIsSyncing(false)
  }
}

performSync()
