import { useState } from 'react'
import { X } from 'lucide-react'
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '../types/transaction'
import type { Transaction, TransactionType, Category } from '../types/transaction'

const TODAY = '2026-08-07'

interface Props {
  onSave: (data: Omit<Transaction, 'id'>) => void
}

interface FormErrors {
  description?: string
  amount?: string
  category?: string
}

export default function AddTransactionCard({ onSave }: Props) {
  const [dismissed, setDismissed] = useState(false)
  const [type, setType] = useState<TransactionType>('expense')
  const [description, setDescription] = useState('')
  const [amountDisplay, setAmountDisplay] = useState('')
  const [category, setCategory] = useState<Category | ''>('')
  const [date, setDate] = useState(TODAY)
  const [errors, setErrors] = useState<FormErrors>({})

  function reset() {
    setType('expense')
    setDescription('')
    setAmountDisplay('')
    setCategory('')
    setDate(TODAY)
    setErrors({})
  }

  function handleTypeChange(t: TransactionType) {
    setType(t)
    setCategory('')
    setErrors((e) => ({ ...e, category: undefined }))
  }

  function handleAmountBlur() {
    const num = parseFloat(amountDisplay.replace(/[^0-9.]/g, ''))
    if (!isNaN(num) && num > 0) setAmountDisplay(num.toFixed(2))
  }

  function validate(): boolean {
    const errs: FormErrors = {}
    if (!description.trim()) errs.description = 'Required'
    const num = parseFloat(amountDisplay.replace(/[^0-9.]/g, ''))
    if (!amountDisplay || isNaN(num) || num <= 0) errs.amount = 'Enter an amount greater than $0.'
    if (!category) errs.category = 'Required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    const num = parseFloat(amountDisplay.replace(/[^0-9.]/g, ''))
    onSave({ type, description: description.trim(), amount: num, category: category as Category, date })
    reset()
  }

  const categories = type === 'expense' ? EXPENSE_CATEGORIES : INCOME_CATEGORIES

  const inputStyle: React.CSSProperties = {
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'var(--paper)',
    border: '1px solid var(--border)',
    borderRadius: '4px',
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '14px',
    color: 'var(--ink)',
    padding: '8px 10px',
    outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '12px',
    fontWeight: 600,
    color: 'var(--graphite)',
    display: 'block',
    marginBottom: '4px',
  }

  const errorStyle: React.CSSProperties = {
    fontFamily: "'DM Sans', sans-serif",
    fontSize: '11px',
    color: 'var(--expense-text)',
    marginTop: '3px',
  }

  if (dismissed) {
    return (
      <button
        onClick={() => setDismissed(false)}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: 'var(--paper)',
          border: '1px dashed var(--border)',
          borderRadius: '8px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--fern-600)',
          cursor: 'pointer',
          transition: 'background-color 150ms',
        }}
        onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--fern-50)' }}
        onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--paper)' }}
      >
        + Add transaction
      </button>
    )
  }

  return (
    <div
      style={{
        backgroundColor: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 18px 14px',
          borderBottom: '1px solid var(--soft-border)',
        }}
      >
        <h3
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '15px',
            fontWeight: 700,
            color: 'var(--ink)',
            margin: 0,
          }}
        >
          Add transaction
        </h3>
        <button
          onClick={() => { reset(); setDismissed(true) }}
          aria-label="Dismiss add transaction card"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            borderRadius: '4px',
            color: 'var(--stone)',
            display: 'flex',
            alignItems: 'center',
            transition: 'color 150ms, background-color 150ms',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--ink)'
            e.currentTarget.style.backgroundColor = 'var(--soft-border)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--stone)'
            e.currentTarget.style.backgroundColor = ''
          }}
        >
          <X size={15} strokeWidth={2} />
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} noValidate style={{ padding: '16px 18px 18px' }}>
        {/* Type toggle */}
        <div
          style={{
            display: 'flex',
            backgroundColor: 'var(--canvas)',
            borderRadius: '4px',
            padding: '3px',
            gap: '2px',
            border: '1px solid var(--border)',
            marginBottom: '14px',
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
                padding: '6px 0',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                transition: 'background-color 150ms, color 150ms',
                backgroundColor: type === t ? 'var(--paper)' : 'transparent',
                color:
                  type === t
                    ? t === 'income' ? 'var(--income-text)' : 'var(--expense-text)'
                    : 'var(--graphite)',
                boxShadow: type === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
              aria-pressed={type === t}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="card-description" style={labelStyle}>Description</label>
          <input
            id="card-description"
            type="text"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
              if (errors.description) setErrors((er) => ({ ...er, description: undefined }))
            }}
            style={{ ...inputStyle, borderColor: errors.description ? 'var(--expense-text)' : 'var(--border)' }}
            onFocus={(e) => { if (!errors.description) e.target.style.borderColor = 'var(--fern-600)' }}
            onBlur={(e) => { if (!errors.description) e.target.style.borderColor = 'var(--border)' }}
            placeholder="e.g. Trader Joe's"
          />
          {errors.description && <p style={errorStyle}>{errors.description}</p>}
        </div>

        {/* Amount */}
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="card-amount" style={labelStyle}>Amount</label>
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontFamily: "'DM Mono', monospace",
                fontSize: '14px',
                color: 'var(--graphite)',
                pointerEvents: 'none',
              }}
            >
              $
            </span>
            <input
              id="card-amount"
              type="text"
              inputMode="decimal"
              value={amountDisplay}
              onChange={(e) => {
                setAmountDisplay(e.target.value)
                if (errors.amount) setErrors((er) => ({ ...er, amount: undefined }))
              }}
              onBlur={handleAmountBlur}
              style={{
                ...inputStyle,
                paddingLeft: '24px',
                fontFamily: "'DM Mono', monospace",
                borderColor: errors.amount ? 'var(--expense-text)' : 'var(--border)',
              }}
              onFocus={(e) => { if (!errors.amount) e.target.style.borderColor = 'var(--fern-600)' }}
              placeholder="0.00"
            />
          </div>
          {errors.amount && <p style={errorStyle}>{errors.amount}</p>}
        </div>

        {/* Category */}
        <div style={{ marginBottom: '12px' }}>
          <label htmlFor="card-category" style={labelStyle}>Category</label>
          <div style={{ position: 'relative' }}>
            <select
              id="card-category"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value as Category)
                if (errors.category) setErrors((er) => ({ ...er, category: undefined }))
              }}
              style={{
                ...inputStyle,
                appearance: 'none',
                WebkitAppearance: 'none',
                paddingRight: '28px',
                borderColor: errors.category ? 'var(--expense-text)' : 'var(--border)',
                cursor: 'pointer',
              }}
              onFocus={(e) => { if (!errors.category) e.target.style.borderColor = 'var(--fern-600)' }}
              onBlur={(e) => { if (!errors.category) e.target.style.borderColor = 'var(--border)' }}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <span
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                pointerEvents: 'none',
                color: 'var(--stone)',
                fontSize: '11px',
              }}
            >
              ▾
            </span>
          </div>
          {errors.category && <p style={errorStyle}>{errors.category}</p>}
        </div>

        {/* Date */}
        <div style={{ marginBottom: '18px' }}>
          <label htmlFor="card-date" style={labelStyle}>Date</label>
          <input
            id="card-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={inputStyle}
            onFocus={(e) => { e.target.style.borderColor = 'var(--fern-600)' }}
            onBlur={(e) => { e.target.style.borderColor = 'var(--border)' }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={reset}
            style={{
              flex: 1,
              padding: '9px 0',
              borderRadius: '4px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: 'var(--graphite)',
              cursor: 'pointer',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--canvas)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent' }}
          >
            Cancel
          </button>
          <button
            type="submit"
            style={{
              flex: 2,
              padding: '9px 0',
              borderRadius: '4px',
              border: 'none',
              backgroundColor: 'var(--fern-600)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
              color: '#fff',
              cursor: 'pointer',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'var(--fern-700)' }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'var(--fern-600)' }}
          >
            Add transaction
          </button>
        </div>

        {Object.keys(errors).length > 0 && (
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '11px',
              color: 'var(--stone)',
              margin: '10px 0 0',
            }}
          >
            Amounts must be greater than $0.
          </p>
        )}
      </form>
    </div>
  )
}
