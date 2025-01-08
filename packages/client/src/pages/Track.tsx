import {createSignal} from 'solid-js'
import JSConfetti from 'js-confetti'
import {categories, Category} from '../categories'
import {formatDate} from 'date-fns'
import {createSpending} from '../spendings/spendings'
import { spendingsByMonth, thisMonthSpendings } from '../spendings/util'

const confetti = new JSConfetti()

export const Track = () => {
  const [value, setValue] = createSignal('')

  const createSpendingWithConfetti = (category: Category, amount: number) => {
    createSpending({category, amount, timestamp: Date.now()})
    confetti.addConfetti({
      emojis: [categories.find(c => c.category === category)?.icon].filter(
        (v): v is string => v != undefined,
      ),
    })
    confetti.addConfetti({
      confettiColors: ['#db924b', '#c59f60'],
    })
  }

  const addSpending = (category: Category) => {
    const amount = parseFloat(value().replace(',', '.'))
    if (!amount) {
      const promptedAmount = prompt(`Enter the amount to spend on ${category}:`)
      if (!promptedAmount) return
      if (isNaN(parseFloat(promptedAmount))) {
        alert('Please specify a valid amount of money spent')
        return
      }
      createSpendingWithConfetti(category, parseFloat(promptedAmount))
    } else if (
      confirm(`You are spending ${amount}₪ on ${category}, confirm?`)
    ) {
      createSpendingWithConfetti(category, amount)
    } else {
      return
    }
    setValue('')
  }

  return (
    <div class="flex flex-col gap-6 flex-1">
      <label class="input input-bordered input-primary flex items-center gap-2">
        Amount
        <input
          type="text"
          class="grow"
          placeholder="120.0"
          value={value()}
          inputmode="decimal"
          onBlur={e => setValue(e.currentTarget.value)}
        />
      </label>
      <div class="grid grid-cols-3 gap-3">
        {categories.map(category => (
          <button
            role="button"
            class="btn btn-outline btn-lg flex flex-col gap-2 justify-center px-0"
            onClick={() => addSpending(category.category)}
          >
            <div class="flex gap-2 items-center">
              <div>{category.icon}</div>
              <div class="text-xs tracking-widest whitespace-nowrap">
                (={' '}
                {thisMonthSpendings()
                  .filter(s => s.category === category.category)
                  .reduce((acc, s) => acc + s.amount, 0)}
                ₪)
              </div>
            </div>
            <div class="text-xs">{category.label}</div>
          </button>
        ))}
      </div>
      <div class="flex-1 -mr-4">
        <ul class="timeline max-w-full overflow-auto">
          <li class="text-xl text-primary sticky start-0 bg-base-100 z-10">
            <div class="timeline-start">This month</div>
            <div class="timeline-middle">₪</div>
            <div class="timeline-end timeline-box">
              {thisMonthSpendings()
                .reduce((acc, s) => acc + s.amount, 0)
                .toFixed(2)}
            </div>
            <hr class="bg-primary" />
          </li>
          {spendingsByMonth().slice(1).map(({spendings, month}, i) => (
            <li>
              <hr class={i === 0 ? 'bg-primary' : 'bg-base-content'} />
              <div class="timeline-start">{formatDate(month, "MMM ''yy")}</div>
              <div class="timeline-middle">₪</div>
              <div class="timeline-end timeline-box">
                {spendings.reduce((acc, s) => acc + s.amount, 0).toFixed(2)}
              </div>
              <hr class="bg-base-content" />
            </li>
          ))}
          <li>
            <div class="timeline-middle px-2">No more expenses</div>
            <div class="timeline-end timeline-box">😎</div>
          </li>
        </ul>
      </div>
    </div>
  )
}
