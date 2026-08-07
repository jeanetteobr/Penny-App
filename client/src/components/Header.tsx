import { useEffect, useId, useRef, useState } from 'react'
import { Calendar, ChevronDown } from 'lucide-react'
import { formatMonthLabel } from '../utils/format'

interface Props {
  selectedMonth: string
  months: string[]
  loading?: boolean
  onMonthChange: (month: string) => void
}

export default function Header({
  selectedMonth,
  months,
  loading = false,
  onMonthChange,
}: Props) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const listId = useId()
  const label = formatMonthLabel(selectedMonth)
  const canOpen = !loading && months.length > 0

  useEffect(() => {
    if (!open) return

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node
      if (
        menuRef.current?.contains(target) ||
        triggerRef.current?.contains(target)
      ) {
        return
      }
      setOpen(false)
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setOpen(false)
        triggerRef.current?.focus()
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  function selectMonth(month: string) {
    onMonthChange(month)
    setOpen(false)
    triggerRef.current?.focus()
  }

  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0 28px', gap: '16px' }}>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontWeight: 700,
          fontSize: '22px',
          color: 'var(--ink)',
          letterSpacing: '-0.02em',
        }}
      >
        penny<span style={{ color: 'var(--fern-600)' }}>.</span>
      </div>

      <div style={{ position: 'relative' }}>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={listId}
          aria-label={`Select month, currently ${label}`}
          disabled={!canOpen}
          onClick={() => {
            if (!canOpen) return
            setOpen((value) => !value)
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            fontWeight: 500,
            color: 'var(--graphite)',
            background: 'none',
            border: 'none',
            padding: '4px 6px',
            borderRadius: '6px',
            cursor: canOpen ? 'pointer' : 'default',
            opacity: loading ? 0.85 : 1,
          }}
        >
          <Calendar size={15} color="var(--stone)" strokeWidth={1.75} aria-hidden="true" />
          <span>{label}</span>
          <ChevronDown size={14} color="var(--stone)" strokeWidth={2} aria-hidden="true" />
        </button>

        {open && (
          <div
            ref={menuRef}
            id={listId}
            role="listbox"
            aria-label="Available months"
            style={{
              position: 'absolute',
              top: 'calc(100% + 6px)',
              right: 0,
              minWidth: '168px',
              backgroundColor: 'var(--paper)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              boxShadow: '0 8px 24px rgba(32, 35, 31, 0.1)',
              padding: '6px',
              zIndex: 30,
            }}
          >
            {months.map((month) => {
              const selected = month === selectedMonth
              return (
                <button
                  key={month}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => selectMonth(month)}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 10px',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    fontWeight: selected ? 600 : 500,
                    color: selected ? 'var(--fern-700)' : 'var(--ink)',
                    backgroundColor: selected ? 'var(--fern-50)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <span>{formatMonthLabel(month)}</span>
                  {selected ? <span aria-hidden="true">✓</span> : null}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </header>
  )
}
