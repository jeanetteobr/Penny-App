export type TransactionType = 'income' | 'expense'

export type Category =
  | 'Food'
  | 'Housing'
  | 'Utilities'
  | 'Shopping'
  | 'Entertainment'
  | 'Transportation'
  | 'Salary'
  | 'Freelance'

export const EXPENSE_CATEGORIES: Category[] = [
  'Food',
  'Housing',
  'Utilities',
  'Shopping',
  'Entertainment',
  'Transportation',
]

export const INCOME_CATEGORIES: Category[] = ['Salary', 'Freelance']

export interface Transaction {
  id: string
  date: string // ISO date string e.g. "2026-08-07"
  description: string
  amount: number
  type: TransactionType
  category: Category
}

export interface CategoryTagStyle {
  bg: string
  text: string
}

export const CATEGORY_TAGS: Record<Category, CategoryTagStyle> = {
  Food: { bg: '#f3eee3', text: '#6b5b3e' },
  Housing: { bg: '#eae6f2', text: '#5b5480' },
  Utilities: { bg: '#e6eef2', text: '#4a6a78' },
  Shopping: { bg: '#f2e8ee', text: '#7a4f65' },
  Entertainment: { bg: '#f2ece0', text: '#7a6540' },
  Transportation: { bg: '#e8efe6', text: '#4f6b54' },
  Salary: { bg: '#eff5ef', text: '#3f6549' },
  Freelance: { bg: '#dde9dd', text: '#3f6549' },
}
