import { JSX } from "solid-js/jsx-runtime"

export type Category = 'groceries' | 'subscriptions' | 'medical' | 'entertainment' | 'clothing' | 'cosmetics' | 'home' | 'coffee' | 'misc'

export type Categories =
  { category: Category, icon: JSX.Element, label: string }[]

export const categories: Categories = [
  { category: 'groceries', icon: <>🛒</>, label: 'Groceries' },
  { category: 'subscriptions', icon: <>📅</>, label: 'Subscriptions' },
  { category: 'medical', icon: <>🏥</>, label: 'Medical' },
  { category: 'entertainment', icon: <>🎬</>, label: 'Entertainment' },
  { category: 'clothing', icon: <>👚</>, label: 'Clothing' },
  { category: 'cosmetics', icon: <>💄</>, label: 'Cosmetics' },
  { category: 'home', icon: <>🛋️</>, label: 'Home' },
  { category: 'coffee', icon: <>🍪</>, label: 'Coffee & Snacks' },
  { category: 'misc', icon: <>🎲</>, label: 'Misc' },
] as const
