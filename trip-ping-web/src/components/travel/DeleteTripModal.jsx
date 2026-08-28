import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './DeleteTripModal.module.css'

export function DeleteTripModal({ open, trip, onClose, onConfirm }) {
  if (!open || !trip) return null

  return (
    <DeleteTripDialog
      key={trip.id}
      trip={trip}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}

function DeleteTripDialog({ trip, onClose, onConfirm }) {
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  const cancelButton = useRef(null)
  const deletingRef = useRef(false)

  useEffect(() => {
    const previousFocus = document.activeElement
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => cancelButton.current?.focus(), 50)

    function handleKeyDown(event) {
      if (event.key === 'Escape' && !deletingRef.current) onClose()
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = ''
      window.clearTimeout(timer)
      document.removeEventListener('keydown', handleKeyDown)
      previousFocus?.focus()
    }
  }, [onClose])

  async function confirmDelete() {
    deletingRef.current = true
    setDeleting(true)
    setError('')

    try {
      await onConfirm(trip.id)
      onClose()
    } catch {
      setError('Não conseguimos apagar agora. Tente de novo em instantes.')
      deletingRef.current = false
      setDeleting(false)
    }
  }

  return createPortal(
    <div
      className={styles.backdrop}
      onMouseDown={(event) => {
        if (!deleting && event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-trip-title"
        aria-describedby="delete-trip-description"
      >
        <span className={styles.stamp} aria-hidden="true">APAGAR?</span>
        <div className={styles.copy}>
          <span>Antes de apagar</span>
          <h2 id="delete-trip-title">Tirar esta viagem da agenda?</h2>
          <p id="delete-trip-description">
            Você está prestes a apagar <strong>{trip.destination}</strong>. As datas e notas
            desse plano não poderão ser recuperadas.
          </p>
        </div>

        {error && <p className={styles.error} role="alert">{error}</p>}

        <div className={styles.actions}>
          <button ref={cancelButton} className={styles.cancel} type="button" onClick={onClose} disabled={deleting}>
            Manter na agenda
          </button>
          <button className={styles.delete} type="button" onClick={confirmDelete} disabled={deleting}>
            {deleting ? 'Apagando…' : 'Apagar viagem'}
          </button>
        </div>
      </section>
    </div>,
    document.body,
  )
}
