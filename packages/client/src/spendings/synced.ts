import {Credentials, insertEvent, syncEvents} from '../sync-events'
import {Spending, SpendingCreate} from '../trpc'
import {timestampPredicate, timestampPredicateAsc} from '../utils'
import {
  createLocalSpending,
  deleteLocalSpending,
  editLocalSpending,
} from './local'

export const syncedSpendings = (_creds: Credentials) => {
  return syncEvents()
    .toSorted(timestampPredicateAsc)
    .reduce<Array<Spending | SpendingCreate>>((acc, event) => {
      switch (event.type) {
        case 'AddSpending':
          return [...acc, event.eventData]
        case 'EditSpending':
          return acc.map(spending =>
            spending.id === event.eventData.id ? event.eventData : spending,
          )
        case 'RemoveSpending':
          return acc.filter(spending => spending.id !== event.eventData.id)
      }
    }, [])
    .toSorted(timestampPredicate)
}

export const createSyncedSpending = (spending: SpendingCreate) => {
  createLocalSpending(spending)
  insertEvent({
    type: 'AddSpending',
    timestamp: Date.now(),
    eventData: spending,
  })
}

export const editSyncedSpending = (spending: Spending) => {
  editLocalSpending(spending)
  insertEvent({
    type: 'EditSpending',
    timestamp: Date.now(),
    eventData: spending,
  })
}

export const deleteSyncedSpending = (
  spendingId: string,
  spendingTimestamp: number,
) => {
  deleteLocalSpending(spendingTimestamp)
  insertEvent({
    type: 'RemoveSpending',
    timestamp: Date.now(),
    eventData: {id: spendingId},
  })
}
