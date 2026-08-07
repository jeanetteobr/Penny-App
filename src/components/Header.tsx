import { Calendar } from 'lucide-react'

export default function Header() {
  return (
    <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 0 28px' }}>
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
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: '14px',
          fontWeight: 500,
          color: 'var(--graphite)',
        }}
      >
        August 2026
        <Calendar size={15} color="var(--stone)" strokeWidth={1.75} />
      </div>
    </header>
  )
}
