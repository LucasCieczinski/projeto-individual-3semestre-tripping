import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { tripStatuses } from '../../data/tripStatuses'
import { Button } from '../ui/Button'
import styles from './TripFormModal.module.css'

const emptyTrip = { destination: '', departureDate: '', returnDate: '', currency: '', status: 'planning', notes: '' }

export function TripFormModal({ open, trip, onClose, onSubmit }) {
  if (!open) return null
  return <TripFormDialog key={trip?.id ?? 'new-trip'} trip={trip} onClose={onClose} onSubmit={onSubmit} />
}

function TripFormDialog({ trip, onClose, onSubmit }) {
  const [form, setForm] = useState(() => trip ? { ...emptyTrip, ...trip } : emptyTrip)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const firstField = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const timer = window.setTimeout(() => firstField.current?.focus(), 50)
    function handleEscape(event) { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', handleEscape)
    return () => { document.body.style.overflow = ''; window.clearTimeout(timer); document.removeEventListener('keydown', handleEscape) }
  }, [onClose])

  function update(field, value) { setForm((current) => ({ ...current, [field]: value })); setError('') }

  async function submit(event) {
    event.preventDefault()
    if (!form.destination.trim() || !form.departureDate || !/^[A-Z]{3}$/.test(form.currency)) {
      setError('Faltou o destino, a data de ida ou a moeda.')
      return
    }
    if (form.returnDate && form.returnDate < form.departureDate) {
      setError('A volta precisa acontecer depois da ida.')
      return
    }
    setSubmitting(true)
    try {
      await onSubmit({
        ...form,
        destination: form.destination.trim(),
        returnDate: form.returnDate || null,
        currency: form.currency.toUpperCase(),
        notes: form.notes.trim() || null,
      })
      onClose()
    } catch {
      setError('Não conseguimos guardar essa viagem. Tente de novo.')
    } finally { setSubmitting(false) }
  }

  return createPortal(
    <div className={styles.backdrop} onMouseDown={(event) => { if (event.target === event.currentTarget) onClose() }}>
      <section className={styles.modal} role="dialog" aria-modal="true" aria-labelledby="trip-form-title">
        <div className={styles.header}>
          <div><span>{trip ? 'Mudança de planos' : 'Nova página'}</span><h2 id="trip-form-title">{trip ? 'Ajustar a viagem' : 'Anotar uma viagem'}</h2></div>
          <button type="button" onClick={onClose} aria-label="Fechar formulário">×</button>
        </div>
        <form onSubmit={submit} noValidate>
          <div className={styles.fieldWide}><label htmlFor="destination">Para onde?</label><input ref={firstField} id="destination" value={form.destination} placeholder="Ex.: Salvador, Brasil" onChange={(event) => update('destination', event.target.value)} /></div>
          <div className={styles.fieldGrid}>
            <div><label htmlFor="departure-date">Quando você vai?</label><input id="departure-date" type="date" value={form.departureDate} onChange={(event) => update('departureDate', event.target.value)} /></div>
            <div><label htmlFor="return-date">Quando volta? <small>se já souber</small></label><input id="return-date" type="date" min={form.departureDate || undefined} value={form.returnDate} onChange={(event) => update('returnDate', event.target.value)} /></div>
          </div>
          <div className={styles.fieldGrid}>
            <div><label htmlFor="currency">Qual moeda?</label><input id="currency" value={form.currency} maxLength="3" placeholder="BRL" onChange={(event) => update('currency', event.target.value.toUpperCase().replace(/[^A-Z]/g, ''))} /></div>
            <div><label htmlFor="status">Como está o plano?</label><select id="status" value={form.status} onChange={(event) => update('status', event.target.value)}>{Object.entries(tripStatuses).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></div>
          </div>
          <div className={styles.fieldWide}><label htmlFor="notes">Algo para não esquecer? <small>opcional</small></label><textarea id="notes" rows="4" maxLength="1000" value={form.notes} placeholder="Uma reserva, um endereço, uma ideia…" onChange={(event) => update('notes', event.target.value)} /><small className={styles.counter}>{form.notes.length}/1000</small></div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <div className={styles.actions}><Button type="button" variant="secondary" onClick={onClose} disabled={submitting}>Deixar para depois</Button><Button type="submit" disabled={submitting}>{submitting ? 'Guardando…' : 'Guardar viagem'}</Button></div>
        </form>
      </section>
    </div>, document.body,
  )
}
