import { useMemo, useState } from 'react'
import { Brand } from '../../components/brand/Brand'
import { DeleteTripModal } from '../../components/travel/DeleteTripModal'
import { TripFormModal } from '../../components/travel/TripFormModal'
import { tripStatuses } from '../../data/tripStatuses'
import { useApp } from '../../context/useApp'
import { useNavigation } from '../../navigation/useNavigation'
import styles from './AgendaPage.module.css'

const filters = [{ value: 'all', label: 'Todas' }, ...Object.entries(tripStatuses).map(([value, label]) => ({ value, label }))]

function formatDate(date, options = {}) {
  if (!date) return 'Não informada'
  return new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: options.short ? 'short' : 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${date}T00:00:00Z`)).replace('.', '')
}

function monthDay(date) {
  const value = new Date(`${date}T00:00:00Z`)
  return { day: String(value.getUTCDate()).padStart(2, '0'), month: new Intl.DateTimeFormat('pt-BR', { month: 'short', timeZone: 'UTC' }).format(value).replace('.', '').toUpperCase() }
}

function duration(trip) {
  if (!trip.returnDate) return 'A volta ainda está em aberto'
  const days = Math.round((new Date(`${trip.returnDate}T00:00:00Z`) - new Date(`${trip.departureDate}T00:00:00Z`)) / 86400000)
  return `${days} ${days === 1 ? 'dia de viagem' : 'dias de viagem'}`
}

export function AgendaPage() {
  const { navigate } = useNavigation()
  const {
    user,
    trips,
    carregandoViagens,
    erroViagens,
    mensagemViagens,
    recarregarViagens,
    addTrip,
    editTrip,
    removeTrip,
    logout,
  } = useApp()
  const [selectedId, setSelectedId] = useState(trips[0]?.id ?? null)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTrip, setEditingTrip] = useState(null)
  const [tripToDelete, setTripToDelete] = useState(null)

  const filteredTrips = useMemo(() => trips.filter((trip) => {
    const matchesFilter = filter === 'all' || trip.status === filter
    const matchesQuery = trip.destination.toLowerCase().includes(query.trim().toLowerCase())
    return matchesFilter && matchesQuery
  }), [filter, query, trips])
  const selected = trips.find((trip) => trip.id === selectedId) ?? trips[0] ?? null
  const activeSelectedId = selected?.id ?? null

  function openCreate() { setEditingTrip(null); setModalOpen(true) }
  function openEdit() { setEditingTrip(selected); setModalOpen(true) }

  async function saveTrip(values) {
    const saved = editingTrip ? await editTrip(editingTrip.id, values) : await addTrip(values)
    setSelectedId(saved.id)
  }

  async function deleteTrip(tripId) {
    await removeTrip(tripId)
  }

  function handleLogout() { logout(); navigate('/') }

  return (
    <div className={styles.page}>
      <header className={styles.topbar}>
        <Brand />
        <div className={styles.account}><span>{user?.name?.slice(0, 1).toUpperCase()}</span><div><strong>{user?.name}</strong><button type="button" onClick={handleLogout}>Sair</button></div></div>
      </header>

      <div className={styles.backgroundArt} aria-hidden="true">
        <div className={styles.postmark}>
          <span>Caderno de bordo</span>
          <strong>TripPing</strong>
          <small>DESDE 2026</small>
        </div>

        <svg className={styles.routeArt} viewBox="0 0 390 470" fill="none">
          <path className={styles.routePath} d="M370 22C238 34 341 158 210 166C83 174 105 278 226 293C347 309 294 405 93 439" />
          <circle className={styles.routePoint} cx="370" cy="22" r="6" />
          <circle className={styles.routePoint} cx="93" cy="439" r="6" />
          <g className={styles.routePlane} transform="translate(202 157) rotate(98)">
            <path d="M0 8L31 0L22 11L31 21L0 13L8 10L0 8Z" />
          </g>
        </svg>

        <div className={styles.routeCaption}>
          <span>ROTA 01</span>
          <strong>de onde estou<br />para onde vou</strong>
        </div>

        <div className={styles.cornerTicket}>
          <span>EMBARQUE</span>
          <strong>PRÓXIMA PARADA</strong>
          <small>UMA BOA HISTÓRIA</small>
        </div>
      </div>

      <main className={styles.main}>
        <section className={styles.pageHeader}>
          <div><span>Caderno aberto</span><h1>Para onde vamos?</h1><p>Suas próximas viagens e tudo o que vale a pena lembrar.</p></div>
          <button className={styles.addButton} type="button" onClick={openCreate}><span aria-hidden="true">＋</span> Anotar viagem</button>
        </section>

        <section className={styles.toolbar} aria-label="Filtros da agenda">
          <div className={styles.filters}>{filters.map((item) => <button key={item.value} type="button" aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}>{item.label}</button>)}</div>
          <label className={styles.search}><span aria-hidden="true">⌕</span><input type="search" aria-label="Buscar destino" placeholder="Procurar um lugar" value={query} onChange={(event) => setQuery(event.target.value)} /></label>
        </section>

        {mensagemViagens && <p className={styles.successMessage} role="status">{mensagemViagens}</p>}

        <section className={styles.content}>
          <aside className={styles.tripList} aria-label="Viagens cadastradas">
            <div className={styles.listHeader}><strong>{filteredTrips.length} {filteredTrips.length === 1 ? 'plano por aqui' : 'planos por aqui'}</strong><span>Mais recentes primeiro</span></div>
            {carregandoViagens ? (
              <div className={styles.emptyList} role="status"><span className={styles.loader} aria-hidden="true" /><strong>Buscando seus planos</strong><span>Só um instante.</span></div>
            ) : erroViagens ? (
              <div className={styles.emptyList} role="alert"><strong>Não conseguimos abrir a agenda</strong><span>{erroViagens}</span><button type="button" onClick={recarregarViagens}>Tentar novamente</button></div>
            ) : filteredTrips.length ? filteredTrips.map((trip) => {
              const date = monthDay(trip.departureDate)
              return (
                <button key={trip.id} className={`${styles.tripCard} ${trip.id === activeSelectedId ? styles.selected : ''}`} type="button" aria-pressed={trip.id === activeSelectedId} onClick={() => setSelectedId(trip.id)}>
                  <span className={styles.cardDate}><strong>{date.day}</strong><small>{date.month}</small></span>
                  <span className={styles.cardContent}><strong>{trip.destination}</strong><small>{formatDate(trip.departureDate, { short: true })}</small><i className={`${styles.status} ${styles[trip.status]}`}>{tripStatuses[trip.status]}</i></span>
                  <span className={styles.arrow} aria-hidden="true">›</span>
                </button>
              )
            }) : <div className={styles.emptyList}><strong>Nada por aqui</strong><span>Tente outro filtro ou anote uma nova viagem.</span></div>}
          </aside>

          <section className={styles.details} aria-live="polite">
            {selected ? (
              <>
                <div className={styles.detailsHeader}>
                  <div><i className={`${styles.status} ${styles[selected.status]}`}>{tripStatuses[selected.status]}</i><h2>{selected.destination}</h2><p>{duration(selected)}</p></div>
                  <div className={styles.detailActions}><button type="button" onClick={openEdit}>Mudar planos</button><button type="button" onClick={() => setTripToDelete(selected)}>Apagar</button></div>
                </div>
                <div className={styles.infoGrid}>
                  <article><span>Ida</span><strong>{formatDate(selected.departureDate)}</strong></article>
                  <article><span>Volta</span><strong>{formatDate(selected.returnDate)}</strong></article>
                  <article><span>Moeda local</span><strong>{selected.currency}</strong></article>
                </div>
                <article className={styles.notes}><span>Para não esquecer</span><p>{selected.notes || 'Nenhuma nota por enquanto.'}</p></article>
              </>
            ) : (
              <div className={styles.emptyDetails}><span aria-hidden="true">＋</span><h2>Uma página em branco</h2><p>Anote a primeira viagem quando quiser.</p><button type="button" onClick={openCreate}>Anotar viagem</button></div>
            )}
          </section>
        </section>
      </main>

      <TripFormModal open={modalOpen} trip={editingTrip} onClose={() => setModalOpen(false)} onSubmit={saveTrip} />
      <DeleteTripModal open={Boolean(tripToDelete)} trip={tripToDelete} onClose={() => setTripToDelete(null)} onConfirm={deleteTrip} />
    </div>
  )
}
