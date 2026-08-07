import { Plus } from 'lucide-react'
import TransactionRow from './TransactionRow'
import type { Transaction } from '../types/transaction'

interface Props {
  transactions: Transaction[]
  totalCount: number
  loading?: boolean
  error?: string | null
  onRetry?: () => void
  hasActiveFilters: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
  onClearFilters: () => void
  onAddTransaction: () => void
}

const COL_HEADERS = [
  { label: 'Date', align: 'left' as const },
  { label: 'Description', align: 'left' as const },
  { label: 'Category', align: 'left' as const },
  { label: 'Amount', align: 'right' as const },
  { label: 'Actions', align: 'right' as const },
]

export default function TransactionTable({
  transactions,
  totalCount,
  loading = false,
  error = null,
  onRetry,
  hasActiveFilters,
  onEdit,
  onDelete,
  onClearFilters,
  onAddTransaction,
}: Props) {
  if (loading) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--stone)', margin: 0 }}>
          Loading transactions…
        </p>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
          Transactions couldn't be loaded.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--graphite)', margin: '0 0 20px' }}>
          Check that the API is running, then try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            style={{
              backgroundColor: 'transparent',
              color: 'var(--fern-600)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--fern-200)',
              cursor: 'pointer',
            }}
          >
            Retry
          </button>
        )}
      </div>
    )
  }

  if (totalCount === 0 && !hasActiveFilters) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
          No transactions for this month.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--graphite)', margin: '0 0 20px' }}>
          Add a transaction in this period, or choose another month.
        </p>
        <button
          type="button"
          onClick={onAddTransaction}
          style={{
            backgroundColor: 'var(--fern-600)',
            color: '#fff',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            padding: '10px 18px',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Plus size={15} strokeWidth={2.5} />
          Add transaction
        </button>
      </div>
    )
  }

  if (totalCount === 0 && hasActiveFilters) {
    return (
      <div style={{ padding: '56px 0', textAlign: 'center' }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '15px', fontWeight: 600, color: 'var(--ink)', margin: '0 0 6px' }}>
          No transactions match those filters.
        </p>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: '14px', color: 'var(--graphite)', margin: '0 0 20px' }}>
          Try changing your search or clearing a filter.
        </p>
        <button
          type="button"
          onClick={onClearFilters}
          style={{
            backgroundColor: 'transparent',
            color: 'var(--fern-600)',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 600,
            padding: '8px 16px',
            borderRadius: '6px',
            border: '1px solid var(--fern-200)',
            cursor: 'pointer',
          }}
        >
          Clear filters
        </button>
      </div>
    )
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border)' }}>
            {COL_HEADERS.map(({ label, align }) => (
              <th
                key={label}
                style={{
                  padding: `0 ${label === 'Actions' ? '0' : '16px'} 11px ${label === 'Date' ? '0' : '16px'}`,
                  textAlign: align,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '12px',
                  fontWeight: 600,
                  color: 'var(--stone)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((t) => (
            <TransactionRow key={t.id} transaction={t} onEdit={onEdit} onDelete={onDelete} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
