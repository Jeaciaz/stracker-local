import { createSignal } from "solid-js"
import JSConfetti from 'js-confetti'
import { categories, Category } from "../categories";
import { setSpendings, thisMonthSpendings } from "../spendings";

const confetti = new JSConfetti()

export const Track = () => {
  const [value, setValue] = createSignal('');

  const createSpending = (category: Category, amount: number) => {
    setSpendings(spendings => [{ category: category, amount, datetime: Date.now() }, ...spendings])
    confetti.addConfetti({
      emojis: [categories.find(c => c.category === category)?.icon].filter((v): v is string => v != undefined),
    });
    confetti.addConfetti({
      confettiColors: ['#db924b', '#c59f60']
    })
  }

  const addSpending = (category: Category) => {
    const amount = parseFloat(value().replace(',', '.'))
    if (!amount) {
      const promptedAmount = prompt(`Enter the amount to spend on ${category}:`)
      if (!promptedAmount)
        return
      if (isNaN(parseFloat(promptedAmount))) {
        alert('Please specify a valid amount of money spent')
        return
      }
      createSpending(category, parseFloat(promptedAmount))
    } else if (confirm(`You are spending ${amount}₪ on ${category}, confirm?`)) {
      createSpending(category, amount)
    } else {
      return
    }
    setValue('')
  }

  return (
    <div class="flex flex-col gap-6">
      <label class="input input-bordered input-primary flex items-center gap-2">
        Amount
        <input
          type="text"
          class="grow"
          placeholder="120.0"
          value={value()}
          inputmode="decimal"
          onBlur={e => setValue(e.currentTarget.value)} />
      </label>
      <div class="grid grid-cols-3 gap-3">
        {categories.map(category => (
          <button
            role="button"
            class="btn btn-outline btn-lg flex flex-col gap-2 justify-center px-0"
            onClick={() => addSpending(category.category)}
          >
            <div class="flex gap-2 items-center">
              <div>
                {category.icon}
              </div>
              <div class="text-xs tracking-widest whitespace-nowrap">
                (= {thisMonthSpendings().filter(s => s.category === category.category).reduce((acc, s) => acc + s.amount, 0)}₪)
              </div>
            </div>
            <div class="text-xs">{category.label}</div>
          </button>
        ))}
      </div>
      <div class="text-xl divider divider-primary">Total spent this month: {thisMonthSpendings().reduce((acc, s) => acc + s.amount, 0)}₪</div>
    </div>
  )
}
