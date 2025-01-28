import {LocalSpending} from '../trpc'
import {createLocalSignal} from '../utils'

const [localSpendings, setLocalSpendings] = createLocalSignal<LocalSpending[]>(
  'spendings',
  [],
)

export {localSpendings}

export const createLocalSpending = (newSpending: LocalSpending) =>
  setLocalSpendings(spendings => [...spendings, newSpending])

export const editLocalSpending = (editedSpending: LocalSpending) =>
  setLocalSpendings(spendings =>
    spendings.map(s =>
      s.timestamp === editedSpending.timestamp ? editedSpending : s,
    ),
  )

export const deleteLocalSpending = (spendingTimestamp: number) =>
  setLocalSpendings(spendings =>
    spendings.filter(s => s.timestamp !== spendingTimestamp),
  )
