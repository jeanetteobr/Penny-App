import { useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import type { Transaction, TransactionType, Category } from '../types/transaction'

const TODAY = '2026-08-07'

interface FormState {
  type: TransactionType
  description: string
  amount: string
  category: Category | ''
  date: string
}

interface FormErrors {
  description?: string
  amount?: string
  category?: string
  date?: string
}

interface Props {
  mode: 'add' | 'edit'
  transaction?: Transaction
  onSave: (data: Omit<Transaction, 'id'>) => Promise<void>
  onClose: () => void
}

export default function TransactionPanel({ mode, transaction, onSave, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const firstFocusRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  const initial: FormState = {
    type: transaction?.type ?? 'expense',
    description: transaction?.description ?? '',
    amount: transaction?.amount ? String(transaction.amount) : '',
    category: transaction?.category ?? '',
    date: transaction?.date ?? TODAY,
  }
  const [form, setForm] = useState<FormState>(initial)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [amountDisplay, setAmountDisplay] = useState(
    transaction?.amount ? transaction.amount.toFixed(2) : ''
  )

  useEffect(() => {
    // Animate in
    requestAnimationFrame(() => setVisible(true))
    firstFocusRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleClose()
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleClose() {
    setVisible(false)
    setTimeout(onClose, 200)
  }

  function handleTypeChange(newType: TransactionType) {
    const currentCategoryValid =
      newType === 'expense'
        ? EXPENSE_CATEGORIES.includes(form.category as Category)
        : INCOME_CATEGORIES.includes(form.category as Category)
    setForm((f) => ({ ...f, type: newType, category: currentCategoryValid ? f.category : '' }))
    setErrors((e) => ({ ...e, category: undefined }))
  }

  function handleAmountChange(raw: string) {
    setAmountDisplay(raw)
    // Auto-switch type when user types a leading + or -
    const trimmed = raw.trim()
    if (trimmed.startsWith('-')) {
      handleTypeChange('expense')
    } else if (trimmed.startsWith('+')) {
      handleTypeChange('income')
    }
    const num = parseFloat(trimmed.replace(/[^0-9.]/g, ''))
    setForm((f) => ({ ...f, amount: isNaN(num) ? '' : String(num) }))
    if (errors.amount) setErrors((er) => ({ ...er, amount: undefined }))
  }

  function handleAmountBlur() {
    const num = parseFloat(amountDisplay.replace(/[^0-9.]/g, ''))
    if (!isNaN(num) && num > 0) {
      setAmountDisplay(num.toFixed(2))
      setForm((f) => ({ ...f, amount: String(num) }))
    }
  }

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!form.description.trim()) errs.description = 'Enter a description.'
    const num = parseFloat(form.amount)
    if (!form.amount || isNaN(num) || num <= 0) errs.amount = 'Enter an amount greater than $0.'
    if (!form.category) errs.category = 'Select a category.'
    if (!form.date) errs.date = 'Select a date.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate() || submitting) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      await onSave({
        type: form.type,
        description: form.description.trim(),
        amount: parseFloat(form.amount),
        category: form.category as Category,
        date: form.date,
      })
      handleClose()
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Transaction could not be saved.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const categories = form.type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--graphite)',
    display: 'block',
    marginBottom: '6px',
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '15px',
    color: 'var(--ink)',
    padding: '10px 12px',
    outline: 'none',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    color: 'var(--expense-text)',
    marginTop: '4px',
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleClose}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(32, 35, 31, 0.35)',
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transition: 'opacity 200ms ease',
        }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={mode === 'add' ? 'Add transaction' : 'Edit transaction'}
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '440px',
          backgroundColor: 'var(--paper)',
          borderLeft: '1px solid var(--border)',
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          transform: visible ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 200ms ease',
          boxShadow: '-4px 0 24px rgba(32, 35, 31, 0.08)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px 28px 20px',
            borderBottom: '1px solid var(--soft-border)',
          }}
        >
          <h2
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '18px',
              fontWeight: 600,
              color: 'var(--ink)',
              margin: 0,
            }}
          >
            {mode === 'add' ? 'Add transaction' : 'Edit transaction'}
          </h2>
          <button
            ref={firstFocusRef}
            onClick={handleClose}
            aria-label="Close panel"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '6px',
              borderRadius: '4px',
              color: 'var(--stone)',
              display: 'flex',
              alignItems: 'center',
              transition: 'color 150ms, background-color 150ms',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget
              el.style.color = 'var(--ink)'
              el.style.backgroundColor = 'var(--soft-border)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget
              el.style.color = 'var(--stone)'
              el.style.backgroundColor = ''
            }}
          >
            <X size={18} strokeWidth={2} />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          style={{ flex: 1, overflowY: 'auto', padding: '28px' }}
        >
          {/* Type segmented control */}
          <div style={{ marginBottom: '20px' }}>
            <span style={labelStyle}>Type</span>
            <div
              style={{
                display: 'flex',
                backgroundColor: 'var(--canvas)',
                borderRadius: '4px',
                padding: '3px',
                gap: '2px',
                border: '1px solid var(--border)',
              }}
              role="group"
              aria-label="Transaction type"
            >
              {(['expense', 'income'] as TransactionType[]).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => handleTypeChange(t)}
                  style={{
                    flex: 1,
                    padding: '7px 0',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 600,
                    transition: 'background-color 150ms, color 150ms',
                    backgroundColor: form.type === t ? 'var(--paper)' : 'transparent',
                    color:
                      form.type === t
                        ? t === 'income'
                          ? 'var(--income-text)'
                          : 'var(--expense-text)'
                        : 'var(--graphite)',
                    boxShadow: form.type === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                  }}
                  aria-pressed={form.type === t}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="description" style={labelStyle}>
              Description
            </label>
            <input
              id="description"
              type="text"
              value={form.description}
              onChange={(e) => {
                setForm((f) => ({ ...f, description: e.target.value }))
                if (errors.description) setErrors((er) => ({ ...er, description: undefined }))
              }}
              style={{
                ...inputStyle,
                borderColor: errors.description ? 'var(--expense-text)' : 'var(--border)',
              }}
              onFocus={(e) => {
                if (!errors.description) e.target.style.borderColor = 'var(--fern-600)'
              }}
              onBlur={(e) => {
                if (!errors.description) e.target.style.borderColor = 'var(--border)'
              }}
              placeholder="e.g. Trader Joe's"
            />
            {errors.description && <p style={errorStyle}>{errors.description}</p>}
          </div>

          {/* Amount */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="amount" style={labelStyle}>
              Amount
            </label>
            <div style={{ position: 'relative' }}>
              {/* Hide the $ prefix when user has typed a +/- sign */}
              {!/^[+-]/.test(amountDisplay) && (
                <span
                  style={{
                    position: 'absolute',
                    left: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '15px',
                    color: 'var(--graphite)',
                    pointerEvents: 'none',
                  }}
                >
                  $
                </span>
              )}
              <input
                id="amount"
                type="text"
                inputMode="decimal"
                value={amountDisplay}
                onChange={(e) => handleAmountChange(e.target.value)}
                onBlur={handleAmountBlur}
                style={{
                  ...inputStyle,
                  paddingLeft: '28px',
                  fontFamily: "'DM Mono', monospace",
                  borderColor: errors.amount ? 'var(--expense-text)' : 'var(--border)',
                }}
                onFocus={(e) => {
                  if (!errors.amount) e.target.style.borderColor = 'var(--fern-600)'
                }}
                placeholder="0.00"
              />
            </div>
            {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
          </div>

          {/* Category */}
          <div style={{ marginBottom: '16px' }}>
            <label htmlFor="category" style={labelStyle}>
              Category
            </label>
            <div style={{ position: 'relative' }}>
              <select
                id="category"
                value={form.category}
                onChange={(e) => {
                  setForm((f) => ({ ...f, category: e.target.value as Category }))
                  if (errors.category) setErrors((er) => ({ ...er, category: undefined }))
                }}
                style={{
                  ...inputStyle,
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  paddingRight: '36px',
                  borderColor: errors.category ? 'var(--expense-text)' : 'var(--border)',
                  cursor: 'pointer',
                }}
                onFocus={(e) => {
                  if (!errors.category) e.target.style.borderColor = 'var(--fern-600)'
                }}
                onBlur={(e) => {
                  if (!errors.category) e.target.style.borderColor = 'var(--border)'
                }}
              >
                <option value="">Select a category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              <span
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  pointerEvents: 'none',
                  color: 'var(--stone)',
                  fontSize: '12px',
                }}
              >
                ▾
              </span>
            </div>
            {errors.category && <p style={errorStyle}>{errors.category}</p>}
          </div>

          {/* Date */}
          <div style={{ marginBottom: '28px' }}>
            <label htmlFor="date" style={labelStyle}>
              Date
            </label>
            <input
              id="date"
              type="date"
              value={form.date}
              onChange={(e) => {
                setForm((f) => ({ ...f, date: e.target.value }))
                if (errors.date) setErrors((er) => ({ ...er, date: undefined }))
              }}
              style={{
                ...inputStyle,
                borderColor: errors.date ? 'var(--expense-text)' : 'var(--border)',
              }}
              onFocus={(e) => {
                if (!errors.date) e.target.style.borderColor = 'var(--fern-600)'
              }}
              onBlur={(e) => {
                if (!errors.date) e.target.style.borderColor = 'var(--border)'
              }}
            />
            {errors.date && <p style={errorStyle}>{errors.date}</p>}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              style={{
                flex: 1,
                padding: '11px 0',
                borderRadius: '4px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                color: 'var(--graphite)',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.7 : 1,
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--canvas)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              aria-busy={submitting}
              style={{
                flex: 2,
                padding: '11px 0',
                borderRadius: '4px',
                border: 'none',
                backgroundColor: 'var(--fern-600)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '15px',
                fontWeight: 600,
                color: '#fff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                opacity: submitting ? 0.75 : 1,
                transition: 'background-color 150ms',
              }}
              onMouseEnter={(e) => {
                if (!submitting) {
                  ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fern-700)'
                }
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--fern-600)'
              }}
            >
              {submitting
                ? mode === 'add'
                  ? 'Adding…'
                  : 'Saving…'
                : mode === 'add'
                  ? 'Add transaction'
                  : 'Save changes'}
            </button>
          </div>
          {submitError && (
            <p style={{ ...errorStyle, marginTop: '10px' }} role="alert">
              {submitError}
            </p>
          )}
        </form>
      </div>
    </>
  )
}
