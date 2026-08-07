import { TrendingUp, TrendingDown } from 'lucide-react'
import { formatCurrency } from '../utils/format'

interface Props {
  type: 'income' | 'expense'
  amount: number
}

export default function SummaryCard({ type, amount }: Props) {
  const isIncome = type === 'income'
  return (
    <div
      style={{
        backgroundColor: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: '6px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        minWidth: 0,
      }}
    >
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '6px',
          backgroundColor: isIncome ? 'var(--income-bg)' : 'var(--expense-bg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {isIncome ? (
          <TrendingUp size={16} color="var(--income-text)" strokeWidth={2} />
        ) : (
          <TrendingDown size={16} color="var(--expense-text)" strokeWidth={2} />
        )}
      </div>
      <div>
        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            fontWeight: 500,
            color: 'var(--stone)',
            marginBottom: '3px',
          }}
        >
          {isIncome ? 'Income' : 'Expenses'}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '18px',
            fontWeight: 500,
            color: isIncome ? 'var(--income-text)' : 'var(--expense-text)',
            letterSpacing: '-0.02em',
          }}
        >
          {isIncome ? '+' : '−'}{formatCurrency(amount)}
        </div>
      </div>
    </div>
  )
}
