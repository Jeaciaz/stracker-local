import {Credentials, insertEvent, syncEvents} from '../sync-events'
import {Spending, SpendingCreate} from '../trpc'

export const syncedSpendings = (_creds: Credentials) => {
  return syncEvents().reduce<Array<Spending | SpendingCreate>>((acc, event) => {
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
}

export const createSyncedSpending = (spending: SpendingCreate) => {
  insertEvent({
    type: 'AddSpending',
    timestamp: Date.now(),
    eventData: spending,
  })
}

export const editSyncedSpending = (spending: Spending) => {
  insertEvent({
    type: 'EditSpending',
    timestamp: Date.now(),
    eventData: spending,
  })
}

export const deleteSyncedSpending = (spendingId: string) => {
  insertEvent({
    type: 'RemoveSpending',
    timestamp: Date.now(),
    eventData: {id: spendingId},
  })
}
