import React from 'react'
import { formatCurrency } from '../utils/format'
import type { CategoryBreakdown } from '../hooks/useInsights'

type IconComponent = React.ComponentType<{ size?: number; strokeWidth?: number; color?: string }>

interface Props extends CategoryBreakdown {
  maxAmount: number
  icon: IconComponent
}

export default function CategoryBar({ category, amount, percentage, maxAmount, icon: Icon }: Props) {
  const barWidth = maxAmount > 0 ? (amount / maxAmount) * 100 : 0
  const ariaLabel = `${category}: ${formatCurrency(amount)}, ${percentage.toFixed(1)}% of non-housing spending`

  return (
    <div
      style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
      role="row"
      aria-label={ariaLabel}
    >
      {/* Icon + name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          width: '110px',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: 'var(--fern-50)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Icon size={11} color="var(--fern-700)" strokeWidth={2} />
        </div>
        <span
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '12px',
            fontWeight: 500,
            color: 'var(--graphite)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {category}
        </span>
      </div>

      {/* Proportional bar */}
      <div
        style={{
          flex: 1,
          height: '5px',
          backgroundColor: 'var(--fern-100)',
          borderRadius: '3px',
          overflow: 'hidden',
          minWidth: 0,
        }}
        aria-hidden="true"
      >
        <div
          style={{
            height: '100%',
            width: `${barWidth}%`,
            backgroundColor: 'var(--fern-600)',
            borderRadius: '3px',
            transition: 'width 300ms ease',
          }}
        />
      </div>

      {/* Amount */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '12px',
          fontWeight: 500,
          color: 'var(--ink)',
          width: '58px',
          textAlign: 'right',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {formatCurrency(amount)}
      </div>

      {/* Percentage */}
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: '11px',
          fontWeight: 400,
          color: 'var(--stone)',
          width: '40px',
          textAlign: 'right',
          flexShrink: 0,
        }}
        aria-hidden="true"
      >
        {percentage.toFixed(1)}%
      </div>
    </div>
  )
}
