import { useState, useMemo } from 'react'
import { INITIAL_TRANSACTIONS } from '../data/transactions'
import type { Transaction } from '../types/transaction'

let nextId = INITIAL_TRANSACTIONS.length + 1

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS)

  const totalIncome = useMemo(
    () => transactions.filter((t) => t.type === 'income').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )

  const totalExpenses = useMemo(
    () => transactions.filter((t) => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0),
    [transactions]
  )

  const balance = totalIncome - totalExpenses

  function addTransaction(data: Omit<Transaction, 'id'>) {
    const newTransaction: Transaction = { ...data, id: String(nextId++) }
    setTransactions((prev) =>
      [newTransaction, ...prev].sort((a, b) => b.date.localeCompare(a.date))
    )
  }

  function updateTransaction(updated: Transaction) {
    setTransactions((prev) =>
      prev
        .map((t) => (t.id === updated.id ? updated : t))
        .sort((a, b) => b.date.localeCompare(a.date))
    )
  }

  function deleteTransaction(id: string) {
    setTransactions((prev) => prev.filter((t) => t.id !== id))
  }

  return {
    transactions,
    totalIncome,
    totalExpenses,
    balance,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  }
}
