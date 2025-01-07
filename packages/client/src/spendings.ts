import {setDate, startOfMonth, subDays, subMonths} from 'date-fns'
import {Category} from './categories'
import {createLocalSignal} from './utils'
import {Spending, SpendingCreate} from './trpc'
import {insertEvent, syncCredentials, syncEvents} from './sync-events'

const PERIOD_START_DAY = 2

const [_spendings, _setSpendings] = createLocalSignal<SpendingCreate[]>(
  'spendings',
  [],
)

export const spendings = () => {
  const creds = syncCredentials()
  if (creds) {
    return syncEvents().reduce<Array<Spending | SpendingCreate>>(
      (acc, event) => {
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
      },
      [],
    )
  } else {
    return _spendings()
  }
}
export const createSpending = (spending: SpendingCreate) => {
  const creds = syncCredentials()
  if (creds) {
    insertEvent({
      type: 'AddSpending',
      timestamp: Date.now(),
      eventData: {...spending, username: creds.username},
    })
  } else {
    _setSpendings(list => [...list, spending])
  }
}

export const editSpending = (spending: Spending | SpendingCreate) => {
  const creds = syncCredentials()
  if (creds && spending.id) {
    insertEvent({
      type: 'EditSpending',
      timestamp: Date.now(),
      eventData: spending,
    })
  } else {
    _setSpendings(list => [...list, spending])
  }
}

// migration
_setSpendings(spendings =>
  spendings.map(({timestamp, ...spending}) => ({
    ...spending,
    timestamp,
  })),
)

export const thisMonthSpendings = () =>
  spendings().filter(({timestamp}) => {
    const lastPeriodStart =
      new Date().getUTCDate() >= PERIOD_START_DAY
        ? setDate(new Date(), PERIOD_START_DAY)
        : setDate(subMonths(new Date(), 1), PERIOD_START_DAY)
    return timestamp > lastPeriodStart.valueOf()
  })

export const spendingsByMonth = [
  ...spendings()
    .reduce((acc, spending) => {
      const spendingMonth = startOfMonth(
        subDays(spending.timestamp, 1),
      ).valueOf()
      acc.set(
        spendingMonth,
        acc.get(spendingMonth)?.concat([spending]) ?? [spending],
      )
      return acc
    }, new Map<number, SpendingCreate[]>())
    .entries(),
]
  .sort((a, b) => b[0] - a[0])
  .map(([month, spendings]) => ({month: new Date(month), spendings}))
