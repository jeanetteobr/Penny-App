import { Pencil, Trash2 } from 'lucide-react'
import CategoryTag from './CategoryTag'
import { formatCurrency, formatDate } from '../utils/format'
import type { Transaction } from '../types/transaction'

interface Props {
  transaction: Transaction
  onEdit: (transaction: Transaction) => void
  onDelete: (transaction: Transaction) => void
}

export default function TransactionRow({ transaction, onEdit, onDelete }: Props) {
  const isIncome = transaction.type === 'income'

  return (
    <tr
      style={{ borderBottom: '1px solid var(--soft-border)' }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = 'rgba(247,245,239,0.6)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLTableRowElement).style.backgroundColor = ''
      }}
    >
      <td
        style={{
          padding: '13px 16px 13px 0',
          fontFamily: "'DM Mono', monospace",
          fontSize: '13px',
          fontWeight: 400,
          color: 'var(--graphite)',
          whiteSpace: 'nowrap',
        }}
      >
        {formatDate(transaction.date)}
      </td>
      <td
        style={{
          padding: '13px 16px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          color: 'var(--ink)',
        }}
      >
        {transaction.description}
      </td>
      <td style={{ padding: '13px 16px' }}>
        <CategoryTag category={transaction.category} />
      </td>
      <td
        style={{
          padding: '13px 16px',
          textAlign: 'right',
          fontFamily: "'DM Mono', monospace",
          fontSize: '14px',
          fontWeight: 500,
          color: isIncome ? 'var(--income-text)' : 'var(--expense-text)',
          whiteSpace: 'nowrap',
        }}
      >
        <span aria-hidden="true">{isIncome ? '+' : '−'}</span>
        {formatCurrency(transaction.amount)}
      </td>
      <td style={{ padding: '13px 0 13px 16px', textAlign: 'right', whiteSpace: 'nowrap' }}>
        <button
          onClick={() => onEdit(transaction)}
          aria-label={`Edit transaction: ${transaction.description}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            color: 'var(--stone)',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'color 150ms ease, background-color 150ms ease',
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
          <Pencil size={14} strokeWidth={2} />
        </button>
        <button
          onClick={() => onDelete(transaction)}
          aria-label={`Delete transaction: ${transaction.description}`}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '5px',
            borderRadius: '3px',
            color: 'var(--stone)',
            display: 'inline-flex',
            alignItems: 'center',
            transition: 'color 150ms ease, background-color 150ms ease',
            marginLeft: '2px',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.color = 'var(--expense-text)'
            el.style.backgroundColor = 'var(--expense-bg)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.color = 'var(--stone)'
            el.style.backgroundColor = ''
          }}
        >
          <Trash2 size={14} strokeWidth={2} />
        </button>
      </td>
    </tr>
  )
}
