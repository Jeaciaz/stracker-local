import { setDate, subMonths } from "date-fns";
import { Category } from "./categories";
import { createLocalStore } from "./utils";

const PERIOD_START_DAY = 2;

export type Spending = {
  category: Category;
  amount: number;
  datetime: number;
}

export const [spendings, setSpendings] = createLocalStore<Spending[]>('spendings', [])

export const thisMonthSpendings = () => spendings.filter(({datetime}) => {
  const lastPeriodStart = new Date().getUTCDate() >= 2
    ? setDate(new Date(), 2)
    : setDate(subMonths(new Date(), 1), 2)
  return datetime > lastPeriodStart.valueOf();
})
