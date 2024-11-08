import { setDate, startOfMonth, subDays, subMonths } from "date-fns";
import { Category } from "./categories";
import { createLocalStore } from "./utils";

const PERIOD_START_DAY = 2;

export type Spending = {
  category: Category;
  amount: number;
  datetime: number;
}

export const [spendings, setSpendings] = createLocalStore<Spending[]>('spendings', [])

export const thisMonthSpendings = () => spendings.filter(({ datetime }) => {
  const lastPeriodStart = new Date().getUTCDate() >= PERIOD_START_DAY
    ? setDate(new Date(), PERIOD_START_DAY)
    : setDate(subMonths(new Date(), 1), PERIOD_START_DAY)
  return datetime > lastPeriodStart.valueOf()
})

export const spendingsByMonth = [...spendings.reduce((acc, spending) => {
  const spendingMonth = startOfMonth(subDays(spending.datetime, 1)).valueOf();
  acc.set(spendingMonth, acc.get(spendingMonth)?.concat([spending]) ?? [spending])
  return acc
}, new Map<number, Spending[]>()).entries()]
  .sort((a, b) => b[0] - a[0])
  .map(([month, spendings]) => ({ month: new Date(month), spendings }))
