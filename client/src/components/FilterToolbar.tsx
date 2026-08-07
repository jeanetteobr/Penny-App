import { Search, ChevronDown } from 'lucide-react'
import type { Category, TransactionType } from '../types/transaction'

interface Props {
  search: string
  typeFilter: TransactionType | 'all'
  categoryFilter: Category | 'all'
  availableCategories: Category[]
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onTypeChange: (value: TransactionType | 'all') => void
  onCategoryChange: (value: Category | 'all') => void
  onClear: () => void
  inline?: boolean
}

const selectStyle: React.CSSProperties = {
  appearance: 'none',
  WebkitAppearance: 'none',
  backgroundColor: 'var(--paper)',
  border: '1px solid var(--border)',
  borderRadius: '4px',
  fontFamily: "'DM Sans', sans-serif",
  fontSize: '14px',
  color: 'var(--ink)',
  padding: '8px 36px 8px 12px',
  cursor: 'pointer',
  outline: 'none',
}

export default function FilterToolbar({
  search,
  typeFilter,
  categoryFilter,
  availableCategories,
  hasActiveFilters,
  onSearchChange,
  onTypeChange,
  onCategoryChange,
  onClear,
  inline,
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        flexWrap: 'wrap',
        marginBottom: inline ? 0 : '20px',
      }}
    >
      {/* Search */}
      <div style={{ position: 'relative', flex: '1', minWidth: '180px', maxWidth: '280px' }}>
        <Search
          size={15}
          color="var(--stone)"
          style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
        <input
          type="text"
          placeholder="Search transactions…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            backgroundColor: 'var(--paper)',
            border: '1px solid var(--border)',
            borderRadius: '4px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'var(--ink)',
            padding: '8px 12px 8px 34px',
            outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--fern-600)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
        />
      </div>

      {/* Type filter */}
      <div style={{ position: 'relative' }}>
        <select
          value={typeFilter}
          onChange={(e) => onTypeChange(e.target.value as TransactionType | 'all')}
          style={selectStyle}
          aria-label="Filter by type"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>
        <ChevronDown
          size={14}
          color="var(--stone)"
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
      </div>

      {/* Category filter */}
      <div style={{ position: 'relative' }}>
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryChange(e.target.value as Category | 'all')}
          style={selectStyle}
          aria-label="Filter by category"
        >
          <option value="all">All categories</option>
          {availableCategories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <ChevronDown
          size={14}
          color="var(--stone)"
          style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
        />
      </div>

      {/* Clear filters */}
      {hasActiveFilters && (
        <button
          onClick={onClear}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--fern-600)',
            padding: '8px 4px',
            textDecoration: 'underline',
            textDecorationColor: 'transparent',
            transition: 'text-decoration-color 150ms',
          }}
          onMouseEnter={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.textDecorationColor = 'var(--fern-600)'
          }}
          onMouseLeave={(e) => {
            ;(e.currentTarget as HTMLButtonElement).style.textDecorationColor = 'transparent'
          }}
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
