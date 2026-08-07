import { useState, useRef, useEffect } from 'react'
import Header from './components/Header'
import BalanceSection from './components/BalanceSection'
import SpendingInsights from './components/SpendingInsights'
import RecentActivity from './components/RecentActivity'
import TransactionPanel from './components/TransactionPanel'
import DeleteModal from './components/DeleteModal'
import { useTransactions } from './hooks/useTransactions'
import { useInsights, DEFAULT_MONTH } from './hooks/useInsights'
import { useTransactionMonths } from './hooks/useTransactionMonths'
import { useSummary } from './hooks/useSummary'
import type { Transaction, Category, TransactionType } from './types/transaction'

type PanelState =
  | { mode: 'closed' }
  | { mode: 'add' }
  | { mode: 'edit'; transaction: Transaction }

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(DEFAULT_MONTH)
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState<Category | 'all'>('all')

  const {
    summary,
    loading: summaryLoading,
    error: summaryError,
    refresh: refreshSummary,
  } = useSummary()

  const {
    months,
    loading: monthsLoading,
    refresh: refreshMonths,
  } = useTransactionMonths()

  // If the selected month disappears (e.g. last txn deleted), fall back to newest.
  useEffect(() => {
    if (monthsLoading) return
    if (months.length === 0) return
    if (!months.includes(selectedMonth)) {
      setSelectedMonth(months[0])
    }
  }, [months, monthsLoading, selectedMonth])

  const {
    insights,
    loading: insightsLoading,
    error: insightsError,
    refresh: refreshInsights,
  } = useInsights(selectedMonth)

  const {
    transactions,
    loading: transactionsLoading,
    error: transactionsError,
    refresh: refreshTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
  } = useTransactions({
    month: selectedMonth,
    search,
    type: typeFilter,
    category: categoryFilter,
  })

  const [panel, setPanel] = useState<PanelState>({ mode: 'closed' })
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null)

  const addTriggerRef = useRef<HTMLElement | null>(null)

  async function refreshBudgetData() {
    await Promise.allSettled([
      refreshTransactions(),
      refreshSummary(),
      refreshInsights(),
      refreshMonths(),
    ])
  }

  function openAdd(triggerEl?: HTMLElement) {
    if (triggerEl) addTriggerRef.current = triggerEl
    setPanel({ mode: 'add' })
  }

  function openEdit(transaction: Transaction) {
    setPanel({ mode: 'edit', transaction })
  }

  function closePanel() {
    setPanel({ mode: 'closed' })
    setTimeout(() => addTriggerRef.current?.focus(), 50)
  }

  async function handleSave(data: Omit<Transaction, 'id'>) {
    if (panel.mode === 'add') {
      await addTransaction(data)
    } else if (panel.mode === 'edit') {
      await updateTransaction(panel.transaction.id, data)
    } else {
      return
    }
    // Write already succeeded; refresh failures must not surface as save failures.
    void refreshBudgetData()
  }

  function openDelete(transaction: Transaction) {
    setDeletingTransaction(transaction)
  }

  async function confirmDelete() {
    if (!deletingTransaction) return
    await deleteTransaction(deletingTransaction.id)
    setDeletingTransaction(null)
    // Write already succeeded; refresh failures must not surface as delete failures.
    void refreshBudgetData()
  }

  function handleViewCategory(category: Category) {
    setCategoryFilter(category)
    const el = document.getElementById('recent-activity')
    if (!el) return
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.scrollIntoView({ behavior: prefersReducedMotion ? 'instant' : 'smooth', block: 'start' })
    setTimeout(
      () => {
        const heading = el.querySelector<HTMLElement>('h2')
        heading?.focus()
      },
      prefersReducedMotion ? 0 : 420
    )
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--canvas)' }}>
      <div
        style={{ maxWidth: '1240px', margin: '0 auto', padding: '0 20px 80px' }}
        className="penny-container"
      >
        <Header
          selectedMonth={selectedMonth}
          months={months}
          loading={monthsLoading}
          onMonthChange={setSelectedMonth}
        />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 3fr',
            gap: '40px',
            alignItems: 'stretch',
            marginBottom: '48px',
          }}
          className="dashboard-grid"
        >
          <BalanceSection
            balance={summary?.balance ?? 0}
            totalIncome={summary?.income ?? 0}
            totalExpenses={summary?.expenses ?? 0}
            loading={summaryLoading}
            error={summaryError}
            onRetry={() => {
              void refreshSummary()
            }}
          />
          <SpendingInsights
            insights={insights}
            loading={insightsLoading}
            error={insightsError}
            onRetry={() => {
              void refreshInsights()
            }}
            onViewCategory={handleViewCategory}
          />
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--soft-border)', marginBottom: '40px' }} />

        <RecentActivity
          transactions={transactions}
          loading={transactionsLoading}
          error={transactionsError}
          onRetry={() => {
            void refreshTransactions()
          }}
          search={search}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          onSearchChange={setSearch}
          onTypeFilterChange={setTypeFilter}
          onCategoryFilterChange={setCategoryFilter}
          onAddTransaction={() => openAdd()}
          onSaveNewTransaction={async (data) => {
            await addTransaction(data)
            // Write already succeeded; refresh failures must not surface as add failures.
            void refreshBudgetData()
          }}
          onEditTransaction={openEdit}
          onDeleteTransaction={openDelete}
        />
      </div>

      {panel.mode !== 'closed' && (
        <TransactionPanel
          mode={panel.mode}
          transaction={panel.mode === 'edit' ? panel.transaction : undefined}
          onSave={handleSave}
          onClose={closePanel}
        />
      )}

      {deletingTransaction && (
        <DeleteModal
          transaction={deletingTransaction}
          onConfirm={confirmDelete}
          onCancel={() => setDeletingTransaction(null)}
        />
      )}

      <style>{`
        @media (max-width: 1023px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
        @media (max-width: 639px) {
          .penny-container {
            padding: 0 16px 64px !important;
          }
          .insights-grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  )
}
