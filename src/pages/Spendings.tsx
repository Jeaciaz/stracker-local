import { formatDate } from "date-fns"
import { setSpendings, type Spending, spendings, thisMonthSpendings } from "../spendings"
import { Show } from "solid-js"

export const Spendings = () => {
  return (
    <>
      <div class="flex flex-col">
        {spendings.slice(0, thisMonthSpendings().length).map(s => <Spending {...s} />)}
      </div>
      <Show when={spendings.length > thisMonthSpendings().length}>
        <div class="divider divider-primary text-xl py-9 text-center">
          This is the end
          <br />
          of monthly spendings
        </div>
      </Show>
      <div>
        {spendings.slice(thisMonthSpendings().length).map(s => <Spending {...s} />)}
      </div>
    </>
  )
}

const Spending = (spending: Spending) => {
  const editSpending = () => {
    const newAmount = prompt('Please enter the correct amount for this spending:')
    if (newAmount == undefined)
      return
    if (isNaN(parseFloat(newAmount.replace(',', '.')))) {
      alert('You must enter a valid number')
      return
    }
    setSpendings(spendings.map(s => s.datetime !== spending.datetime ? s : { ...s, amount: parseFloat(newAmount) }))
  }

  const deleteSpending = () => {
    if (!confirm(`Are you sure you want to delete spending ${spending.amount}₪ on ${spending.category}?`))
      return
    setSpendings(spendings.filter(s => s.datetime !== spending.datetime))
  }

  return (
    <div class="px-2 py-4 border-b-primary border-b-2 last-of-type:border-b-0 flex">
      <div class="flex flex-col gap-1">
        <div class="text-base">
          Spent {spending.amount}₪ on {spending.category}
        </div>
        <div class="text-xs">{formatDate(spending.datetime, 'hh:mm:ss, dd.MM.yyyy')}</div>
      </div>
      <button class="btn btn-circle ms-auto" onPointerDown={editSpending}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="currentColor" />
        </svg>
      </button>
      <button class="btn btn-circle" onPointerDown={deleteSpending}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
