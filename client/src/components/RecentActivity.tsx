import { useState, useMemo, useEffect } from 'react'
import { Plus } from 'lucide-react'
import FilterToolbar from './FilterToolbar'
import TransactionTable from './TransactionTable'
import Pagination from './Pagination'
import AddTransactionCard from './AddTransactionCard'
import type { Transaction, TransactionType, Category } from '../types/transaction'

const ITEMS_PER_PAGE = 10

interface Props {
  transactions: Transaction[]
  categoryFilter: Category | 'all'
  onCategoryFilterChange: (cat: Category | 'all') => void
  onAddTransaction: () => void
  onSaveNewTransaction: (data: Omit<Transaction, 'id'>) => void
  onEditTransaction: (transaction: Transaction) => void
  onDeleteTransaction: (transaction: Transaction) => void
}

export default function RecentActivity({
  transactions,
  categoryFilter,
  onCategoryFilterChange,
  onAddTransaction,
  onSaveNewTransaction,
  onEditTransaction,
  onDeleteTransaction,
}: Props) {
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<TransactionType | 'all'>('all')
  const [currentPage, setCurrentPage] = useState(1)

  const availableCategories = useMemo(() => {
    const cats = new Set(transactions.map((t) => t.category))
    return Array.from(cats).sort() as Category[]
  }, [transactions])

  const hasActiveFilters = search !== '' || typeFilter !== 'all' || categoryFilter !== 'all'

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false
      if (typeFilter !== 'all' && t.type !== typeFilter) return false
      if (categoryFilter !== 'all' && t.category !== categoryFilter) return false
      return true
    })
  }, [transactions, search, typeFilter, categoryFilter])

  useEffect(() => {
    setCurrentPage(1)
  }, [search, typeFilter, categoryFilter, transactions])

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE))

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return filtered.slice(start, start + ITEMS_PER_PAGE)
  }, [filtered, currentPage])

  function clearFilters() {
    setSearch('')
    setTypeFilter('all')
    onCategoryFilterChange('all')
  }

  const tableAndPagination = (
    <>
      <TransactionTable
        transactions={pagedRows}
        allTransactions={transactions}
        hasActiveFilters={hasActiveFilters}
        onEdit={onEditTransaction}
        onDelete={onDeleteTransaction}
        onClearFilters={clearFilters}
        onAddTransaction={onAddTransaction}
      />
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filtered.length}
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
        {/* Heading row with filters inline */}
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
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '26px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: '0',
              marginRight: 'auto',
              letterSpacing: '-0.01em',
              whiteSpace: 'nowrap',
            }}
          >
            Recent activity.
          </h2>
          <FilterToolbar
            search={search}
            typeFilter={typeFilter}
            categoryFilter={categoryFilter}
            availableCategories={availableCategories}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={setSearch}
            onTypeChange={setTypeFilter}
            onCategoryChange={onCategoryFilterChange}
            onClear={clearFilters}
            inline
          />
        </div>

        {/* Table + add card side by side */}
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
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '22px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: 0,
              letterSpacing: '-0.01em',
            }}
          >
            Recent activity.
          </h2>
          <button
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
          availableCategories={availableCategories}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={setSearch}
          onTypeChange={setTypeFilter}
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
