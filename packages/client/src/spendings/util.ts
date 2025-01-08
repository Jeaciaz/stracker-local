import {setDate, startOfMonth, subDays, subMonths} from 'date-fns'
import {spendings} from './spendings'
import {LocalSpending} from '../trpc'

const PERIOD_START_DAY = 2

export const thisMonthSpendings = () =>
  spendings().filter(({timestamp}) => {
    const lastPeriodStart =
      new Date().getUTCDate() >= PERIOD_START_DAY
        ? setDate(new Date(), PERIOD_START_DAY)
        : setDate(subMonths(new Date(), 1), PERIOD_START_DAY)
    return timestamp > lastPeriodStart.valueOf()
  })

export const spendingsByMonth = () => [
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
    }, new Map<number, LocalSpending[]>())
    .entries(),
]
  .sort((a, b) => b[0] - a[0])
  .map(([month, spendings]) => ({month: new Date(month), spendings}))
