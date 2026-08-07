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
  loading?: boolean
  error?: string | null
  onRetry?: () => void
}

export default function BalanceSection({
  balance,
  totalIncome,
  totalExpenses,
  loading = false,
  error = null,
  onRetry,
}: Props) {
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

      {error ? (
        <div style={{ marginBottom: '28px' }}>
          <p
            style={{
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 500,
              color: 'var(--graphite)',
              margin: '0 0 10px',
            }}
          >
            Summary couldn't be loaded.
          </p>
          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              style={{
                backgroundColor: 'transparent',
                color: 'var(--fern-600)',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 12px',
                borderRadius: '6px',
                border: '1px solid var(--fern-200)',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          )}
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: '48px',
                fontWeight: 500,
                color: loading ? 'var(--stone)' : isNegative ? 'var(--expense-text)' : 'var(--ink)',
                letterSpacing: '-0.03em',
                lineHeight: 1,
                marginBottom: '8px',
              }}
              aria-label={
                loading
                  ? 'Current balance loading'
                  : `Current balance: ${isNegative ? 'negative ' : ''}${formatCurrency(Math.abs(balance))}`
              }
            >
              {loading ? (
                '—'
              ) : (
                <>
                  {isNegative && <span aria-hidden="true">−</span>}
                  {formatCurrency(Math.abs(balance))}
                </>
              )}
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
            <SummaryCard type="income" amount={totalIncome} loading={loading} />
            <SummaryCard type="expense" amount={totalExpenses} loading={loading} />
          </div>
        </>
      )}
    </section>
  )
}
