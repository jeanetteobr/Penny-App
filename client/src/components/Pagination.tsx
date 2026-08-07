import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  onPageChange: (page: number) => void
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange,
}: Props) {
  if (totalPages <= 1) return null

  const start = (currentPage - 1) * itemsPerPage + 1
  const end = Math.min(currentPage * itemsPerPage, totalItems)

  // Build page number list: always show first, last, current ±1, with ellipses
  function getPages(): (number | 'ellipsis')[] {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1)
    const pages: (number | 'ellipsis')[] = [1]
    if (currentPage > 3) pages.push('ellipsis')
    for (let p = Math.max(2, currentPage - 1); p <= Math.min(totalPages - 1, currentPage + 1); p++) {
      pages.push(p)
    }
    if (currentPage < totalPages - 2) pages.push('ellipsis')
    pages.push(totalPages)
    return pages
  }

  const btnBase: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: '32px',
    height: '32px',
    padding: '0 6px',
    borderRadius: '4px',
    border: '1px solid var(--border)',
    backgroundColor: 'var(--paper)',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 500,
    color: 'var(--graphite)',
    cursor: 'pointer',
    transition: 'background-color 150ms, color 150ms, border-color 150ms',
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingTop: '16px',
        flexWrap: 'wrap',
        gap: '12px',
      }}
    >
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '13px',
          color: 'var(--stone)',
        }}
      >
        {start}–{end} of {totalItems} transactions
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        {/* Prev */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
          style={{
            ...btnBase,
            opacity: currentPage === 1 ? 0.4 : 1,
            cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== 1) {
              const el = e.currentTarget
              el.style.backgroundColor = 'var(--canvas)'
              el.style.borderColor = 'var(--graphite)'
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = 'var(--paper)'
            el.style.borderColor = 'var(--border)'
          }}
        >
          <ChevronLeft size={14} strokeWidth={2} />
        </button>

        {/* Page numbers */}
        {getPages().map((p, i) =>
          p === 'ellipsis' ? (
            <span
              key={`ellipsis-${i}`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                color: 'var(--stone)',
                padding: '0 4px',
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              aria-label={`Page ${p}`}
              aria-current={p === currentPage ? 'page' : undefined}
              style={{
                ...btnBase,
                backgroundColor: p === currentPage ? 'var(--fern-600)' : 'var(--paper)',
                borderColor: p === currentPage ? 'var(--fern-600)' : 'var(--border)',
                color: p === currentPage ? '#fff' : 'var(--graphite)',
                fontWeight: p === currentPage ? 600 : 500,
              }}
              onMouseEnter={(e) => {
                if (p !== currentPage) {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'var(--canvas)'
                  el.style.borderColor = 'var(--graphite)'
                }
              }}
              onMouseLeave={(e) => {
                if (p !== currentPage) {
                  const el = e.currentTarget
                  el.style.backgroundColor = 'var(--paper)'
                  el.style.borderColor = 'var(--border)'
                }
              }}
            >
              {p}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
          style={{
            ...btnBase,
            opacity: currentPage === totalPages ? 0.4 : 1,
            cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (currentPage !== totalPages) {
              const el = e.currentTarget
              el.style.backgroundColor = 'var(--canvas)'
              el.style.borderColor = 'var(--graphite)'
            }
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.backgroundColor = 'var(--paper)'
            el.style.borderColor = 'var(--border)'
          }}
        >
          <ChevronRight size={14} strokeWidth={2} />
        </button>
      </div>
    </div>
  )
}
