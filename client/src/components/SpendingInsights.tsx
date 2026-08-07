import React from 'react'
import { Home, Utensils, ShoppingBag, Zap, Car, Tv, Briefcase, Laptop } from 'lucide-react'
import CategoryBar from './CategoryBar'
import { formatCurrency, formatDateShort } from '../utils/format'
import type { InsightsData } from '../hooks/useInsights'
import type { Category } from '../types/transaction'

const CATEGORY_ICONS: Record<Category, React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>> = {
  Food: Utensils,
  Shopping: ShoppingBag,
  Utilities: Zap,
  Transportation: Car,
  Entertainment: Tv,
  Housing: Home,
  Salary: Briefcase,
  Freelance: Laptop,
}

interface Props {
  insights: InsightsData
  onViewCategory?: (category: Category) => void
}

export default function SpendingInsights({ insights, onViewCategory }: Props) {
  const {
    hasEnoughData,
    emptyReason,
    topCategory,
    topCategoryAmount,
    topCategoryPercentage,
    categoryBreakdown,
    largestExpense,
  } = insights

  function emptyMessage() {
    if (emptyReason === 'no-expenses')
      return {
        primary: 'No spending insights yet.',
        secondary: 'Add a few expenses to start seeing patterns in your spending.',
      }
    if (emptyReason === 'all-housing')
      return {
        primary: 'No non-housing spending to compare yet.',
        secondary: null,
      }
    return {
      primary: 'Add a few more transactions to see spending insights.',
      secondary: null,
    }
  }

  const TopIcon = topCategory ? CATEGORY_ICONS[topCategory] : null

  return (
    <section
      style={{
        backgroundColor: 'var(--paper)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '24px 28px',
        height: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Section header */}
      <div style={{ marginBottom: '20px' }}>
        <h2
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '18px',
            fontWeight: 600,
            color: 'var(--ink)',
            margin: '0 0 3px',
          }}
        >
          A little perspective.
        </h2>
        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            color: 'var(--stone)',
            margin: 0,
          }}
        >
          August 2026 · Non-housing spending
        </p>
      </div>

      {!hasEnoughData ? (
        (() => {
          const msg = emptyMessage()
          return (
            <div style={{ padding: '8px 0 4px' }}>
              <p
                style={{
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '14px',
                  fontWeight: 500,
                  color: 'var(--graphite)',
                  margin: '0 0 4px',
                  lineHeight: 1.45,
                }}
              >
                {msg.primary}
              </p>
              {msg.secondary && (
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '13px',
                    color: 'var(--stone)',
                    margin: 0,
                    lineHeight: 1.45,
                  }}
                >
                  {msg.secondary}
                </p>
              )}
            </div>
          )
        })()
      ) : (
        <>
          {/* Two-column insight layout */}
          <div
            className="insights-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '0',
              alignItems: 'start',
            }}
          >
            {/* Left: narrative insight */}
            <div
              style={{
                paddingRight: '24px',
                borderRight: '1px solid var(--soft-border)',
              }}
            >
              {/* Icon + insight sentence */}
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  alignItems: 'flex-start',
                  marginBottom: '16px',
                }}
              >
                {TopIcon && (
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      backgroundColor: 'var(--fern-50)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      marginTop: '1px',
                    }}
                    aria-hidden="true"
                  >
                    <TopIcon size={14} color="var(--fern-700)" strokeWidth={2} />
                  </div>
                )}
                <p
                  style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '14px',
                    fontWeight: 500,
                    color: 'var(--ink)',
                    margin: 0,
                    lineHeight: 1.5,
                  }}
                >
                  {topCategory} was your biggest non-housing spending category this month.
                </p>
              </div>

              {/* Amount + percentage side by side */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '14px',
                  marginBottom: '14px',
                }}
              >
                <div
                  style={{
                    fontFamily: "'DM Mono', monospace",
                    fontSize: '26px',
                    fontWeight: 500,
                    color: 'var(--fern-700)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                  }}
                  aria-label={`${formatCurrency(topCategoryAmount)} spent on ${topCategory}`}
                >
                  {formatCurrency(topCategoryAmount)}
                </div>
                <div style={{ paddingBottom: '1px' }}>
                  <div
                    style={{
                      fontFamily: "'DM Mono', monospace",
                      fontSize: '16px',
                      fontWeight: 500,
                      color: 'var(--fern-600)',
                      lineHeight: 1.1,
                    }}
                  >
                    {topCategoryPercentage.toFixed(1)}%
                  </div>
                  <div
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: '11px',
                      color: 'var(--stone)',
                      lineHeight: 1.3,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    of non-housing spending
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={() => topCategory && onViewCategory?.(topCategory)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: 0,
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--fern-600)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '3px',
                  marginBottom: '18px',
                  textDecoration: 'none',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--fern-700)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--fern-600)'
                }}
                aria-label={`Filter transactions by ${topCategory}`}
              >
                View {topCategory} transactions →
              </button>

              {/* Divider + largest expense */}
              {largestExpense && (
                <div
                  style={{
                    borderTop: '1px solid var(--soft-border)',
                    paddingTop: '16px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--fern-50)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                      aria-hidden="true"
                    >
                      <Home size={13} color="var(--fern-700)" strokeWidth={2} />
                    </div>
                    <div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '11px',
                          fontWeight: 600,
                          color: 'var(--stone)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.07em',
                          marginBottom: '2px',
                        }}
                      >
                        Largest expense
                      </div>
                      <div
                        style={{
                          fontFamily: "'DM Sans', sans-serif",
                          fontSize: '13px',
                          color: 'var(--ink)',
                        }}
                      >
                        {largestExpense.description}{' '}
                        <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
                          {formatCurrency(largestExpense.amount)}
                        </span>
                        {' · '}
                        {formatDateShort(largestExpense.date)}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Right: category breakdown table */}
            <div style={{ paddingLeft: '24px' }}>
              {/* Column headers */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '10px',
                  paddingBottom: '8px',
                  borderBottom: '1px solid var(--soft-border)',
                }}
                role="row"
                aria-label="Column headers"
              >
                <div
                  style={{
                    width: '110px',
                    flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--stone)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Category
                </div>
                <div style={{ flex: 1 }} />
                <div
                  style={{
                    width: '58px',
                    textAlign: 'right',
                    flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--stone)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  Amount
                </div>
                <div
                  style={{
                    width: '40px',
                    textAlign: 'right',
                    flexShrink: 0,
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--stone)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                  }}
                >
                  %
                </div>
              </div>

              {/* Category rows */}
              <div
                role="table"
                aria-label="Non-housing spending breakdown"
                style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
              >
                {categoryBreakdown.map((item) => (
                  <CategoryBar
                    key={item.category}
                    {...item}
                    maxAmount={categoryBreakdown[0]?.amount ?? 1}
                    icon={CATEGORY_ICONS[item.category]}
                  />
                ))}
              </div>
            </div>
          </div>

          <style>{`
            @media (max-width: 639px) {
              .insights-grid {
                grid-template-columns: 1fr !important;
              }
              .insights-grid > *:first-child {
                padding-right: 0 !important;
                border-right: none !important;
                padding-bottom: 20px;
                border-bottom: 1px solid var(--soft-border);
              }
              .insights-grid > *:last-child {
                padding-left: 0 !important;
                padding-top: 20px;
              }
            }
          `}</style>
        </>
      )}
    </section>
  )
}
