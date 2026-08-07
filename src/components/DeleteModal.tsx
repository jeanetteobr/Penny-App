import { useEffect, useRef, useState } from 'react'
import { formatCurrency, formatDateShort } from '../utils/format'
import type { Transaction } from '../types/transaction'

interface Props {
  transaction: Transaction
  onConfirm: () => void
  onCancel: () => void
}

export default function DeleteModal({ transaction, onConfirm, onCancel }: Props) {
  const modalRef = useRef<HTMLDivElement>(null)
  const cancelRef = useRef<HTMLButtonElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true))
    cancelRef.current?.focus()

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') handleCancel()
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [tabindex]:not([tabindex="-1"])'
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

  function handleCancel() {
    setVisible(false)
    setTimeout(onCancel, 180)
  }

  function handleConfirm() {
    setVisible(false)
    setTimeout(onConfirm, 180)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCancel}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(32, 35, 31, 0.4)',
          zIndex: 40,
          opacity: visible ? 1 : 0,
          transition: 'opacity 180ms ease',
        }}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-heading"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: visible
            ? 'translate(-50%, -50%) scale(1)'
            : 'translate(-50%, -52%) scale(0.97)',
          backgroundColor: 'var(--paper)',
          border: '1px solid var(--border)',
          borderRadius: '6px',
          padding: '28px',
          zIndex: 50,
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 8px 32px rgba(32, 35, 31, 0.14)',
          opacity: visible ? 1 : 0,
          transition: 'opacity 180ms ease, transform 180ms ease',
        }}
      >
        <h2
          id="delete-modal-heading"
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '17px',
            fontWeight: 600,
            color: 'var(--ink)',
            margin: '0 0 12px',
          }}
        >
          Delete this transaction?
        </h2>

        <div
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '14px',
            color: 'var(--graphite)',
            backgroundColor: 'var(--canvas)',
            borderRadius: '6px',
            padding: '12px 16px',
            marginBottom: '12px',
            lineHeight: 1.5,
          }}
        >
          {transaction.description}{' '}
          <span style={{ fontFamily: "'DM Mono', monospace", fontWeight: 500 }}>
            {formatCurrency(transaction.amount)}
          </span>
          {' · '}
          {transaction.category}
          {' · '}
          {formatDateShort(transaction.date)}
        </div>

        <p
          style={{
            fontFamily: "'DM Sans', sans-serif",
            fontSize: '13px',
            color: 'var(--stone)',
            margin: '0 0 24px',
          }}
        >
          {"This can't be undone."}
        </p>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            ref={cancelRef}
            onClick={handleCancel}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--graphite)',
              cursor: 'pointer',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--canvas)'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent'
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            style={{
              flex: 1,
              padding: '10px 0',
              borderRadius: '6px',
              border: '1px solid #d9534f',
              backgroundColor: 'var(--expense-bg)',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--expense-text)',
              cursor: 'pointer',
              transition: 'background-color 150ms',
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = '#f5d5d1'
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.backgroundColor = 'var(--expense-bg)'
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </>
  )
}
