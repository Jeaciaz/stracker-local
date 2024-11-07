import { JSX } from "solid-js/jsx-runtime"

export type Category = 'groceries' | 'transport' | 'medical' | 'entertainment' | 'clothing' | 'cosmetics' | 'electronics' | 'fitness' | 'misc'

export type Categories =
  { category: Category, icon: JSX.Element, label: string }[]

export const categories: Categories = [
  { category: 'groceries', icon: <>🛒</>, label: 'Groceries' },
  { category: 'transport', icon: <>🚗</>, label: 'Transport' },
  { category: 'medical', icon: <>🏥</>, label: 'Medical' },
  { category: 'entertainment', icon: <>🎬</>, label: 'Entertainment' },
  { category: 'clothing', icon: <>👚</>, label: 'Clothing' },
  { category: 'cosmetics', icon: <>💄</>, label: 'Cosmetics' },
  { category: 'electronics', icon: <>💻</>, label: 'Electronics' },
  { category: 'fitness', icon: <>🏋️</>, label: 'Fitness' },
  { category: 'misc', icon: <>🎲</>, label: 'Misc' },
] as const
