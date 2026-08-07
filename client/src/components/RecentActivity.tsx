import { useState, useEffect } from 'react'
import { Plus } from 'lucide-react'
import FilterToolbar from './FilterToolbar'
import TransactionTable from './TransactionTable'
import Pagination from './Pagination'
import AddTransactionCard from './AddTransactionCard'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import type { Transaction, TransactionType, Category } from '../types/transaction'

const ITEMS_PER_PAGE = 10
const AVAILABLE_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as Category[]

interface Props {
  transactions: Transaction[]
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  search: string
  typeFilter: TransactionType | 'all'
  categoryFilter: Category | 'all'
  onSearchChange: (value: string) => void
  onTypeFilterChange: (value: TransactionType | 'all') => void
  onCategoryFilterChange: (cat: Category | 'all') => void
  onAddTransaction: () => void
  onSaveNewTransaction: (data: Omit<Transaction, 'id'>) => Promise<void>
  onEditTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (transaction: Transaction) => void
}

export default function RecentActivity({
  transactions,
  loading = false,
  error = null,
  onRetry,
  search,
  typeFilter,
  categoryFilter,
  onSearchChange,
  onTypeFilterChange,
  onCategoryFilterChange,
  onAddTransaction,
  onSaveNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: Props) {
  const [currentPage, setCurrentPage] = useState(1)

  const hasActiveFilters = search !== '' || typeFilter !== 'all' || categoryFilter !== 'all'

  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter, categoryFilter, transactions])

  const totalPages = Math.max(1, Math.ceil(transactions.length / ITEMS_PER_PAGE))

  const pagedRows = transactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  function clearFilters() {
    onSearchChange('')
    onTypeFilterChange('all')
    onCategoryFilterChange('all')
  }

  const tableAndPagination = (
    <>
      <TransactionTable
        transactions={pagedRows}
        totalCount={transactions.length}
        loading={loading}
        error={error}
        onRetry={onRetry}
        hasActiveFilters={hasActiveFilters}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        onClearFilters={clearFilters}
        onAddTransaction={onAddTransaction}
      />
      {!loading && !error && transactions.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={transactions.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  )

  return (
    <section id="recent-activity">
      {/* ── Desktop / tablet layout ───────────────────────────── */}
      <div className="ra-desktop">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '20px',
            flexWrap: 'wrap',
          }}
        >
          <h2
            tabIndex={-1}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '26px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: '0',
              marginRight: 'auto',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
              outline: 'none',
            }}
          >
            Recent activity.
          </h2>
          <FilterToolbar
            search={search}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            availableCategories={AVAILABLE_CATEGORIES}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={onSearchChange}
            onTypeChange={onTypeFilterChange}
            onCategoryChange={onCategoryFilterChange}
            onClear={clearFilters}
            inline
          />
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 272px',
            gap: '20px',
            alignItems: 'start',
          }}
        >
          <div>{tableAndPagination}</div>
          <AddTransactionCard onSave={onSaveNewTransaction} />
        </div>
      </div>

      {/* ── Mobile layout ─────────────────────────────────────── */}
      <div className="ra-mobile">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '16px',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <h2
            tabIndex={-1}
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: 0,
              letterSpacing: '-0.01em',
              outline: 'none',
            }}
          >
            Recent activity.
          </h2>
          <button
            type="button"
            onClick={onAddTransaction}
            style={{
              backgroundColor: 'var(--fern-600)',
              color: '#fff',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              padding: '9px 16px',
              borderRadius: '6px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Plus size={15} strokeWidth={2.5} aria-hidden="true" />
            Add transaction
          </button>
        </div>
        <FilterToolbar
          search={search}
          typeFilter={typeFilter}
          categoryFilter={categoryFilter}
          availableCategories={AVAILABLE_CATEGORIES}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={onSearchChange}
          onTypeChange={onTypeFilterChange}
          onCategoryChange={onCategoryFilterChange}
          onClear={clearFilters}
        />
        {tableAndPagination}
      </div>

      <style>{`
        .ra-mobile { display: none; }
        @media (max-width: 767px) {
          .ra-desktop { display: none; }
          .ra-mobile { display: block; }
        }
      `}</style>
    </section>
  )
}
