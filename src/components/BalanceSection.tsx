import SummaryCard from './SummaryCard'
import { formatCurrency } from '../utils/format'

function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour >= 5 && hour < 12) return 'Good morning.'
  if (hour >= 12 && hour < 17) return 'Good afternoon.'
  return 'Good evening.'
}

const greeting = getGreeting()

interface Props {
  balance: number
  totalIncome: number
  totalExpenses: number
}

export default function BalanceSection({ balance, totalIncome, totalExpenses }: Props) {
  const isNegative = balance < 0

  return (
    <section style={{ paddingBottom: '40px' }}>
      <div style={{ marginBottom: '24px' }}>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '24px',
            fontWeight: 400,
            color: 'var(--graphite)',
            margin: '0',
            lineHeight: 1.25,
          }}
        >
          {greeting}
        </p>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '24px',
            fontWeight: 400,
            color: 'var(--graphite)',
            margin: 0,
            lineHeight: 1.25,
          }}
        >
          {"Here's where things stand."}
        </p>
      </div>

      <div style={{ marginBottom: '28px' }}>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '48px',
            fontWeight: 500,
            color: isNegative ? 'var(--expense-text)' : 'var(--ink)',
            letterSpacing: '-0.03em',
            lineHeight: 1,
            marginBottom: '8px',
          }}
          aria-label={`Current balance: ${isNegative ? 'negative ' : ''}${formatCurrency(Math.abs(balance))}`}
        >
          {isNegative && <span aria-hidden="true">−</span>}
          {formatCurrency(Math.abs(balance))}
        </div>
        <div
          style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            fontWeight: 400,
            color: 'var(--stone)',
            letterSpacing: '0.04em',
          }}
        >
          Current balance
        </div>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
        <SummaryCard type="income" amount={totalIncome} />
        <SummaryCard type="expense" amount={totalExpenses} />
      </div>
    </section>
  )
}
