import {syncCredentials} from '../sync-events'
import {LocalSpending} from '../trpc'
import {createLocalSpending, localSpendings} from './local'
import {createSyncedSpending, syncedSpendings} from './synced'

export const spendings = () => {
  const creds = syncCredentials()
  if (creds) return syncedSpendings(creds)
  else return localSpendings()
}

export const createSpending = (spending: LocalSpending) => {
  const creds = syncCredentials()
  if (creds)
    return createSyncedSpending({...spending, username: creds.username})
  return createLocalSpending(spending)
}
