import { useEffect, useMemo, useReducer } from 'react'
import { travelService } from '../services/travelService'
import { AppContext } from './app-context'

const STORAGE_KEY = 'tripping-agenda-state-v2'

const initialState = {
  user: null,
  trips: [],
  carregandoViagens: false,
  erroViagens: '',
  mensagemViagens: '',
}

function getInitialState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return { ...initialState, user: saved?.user ?? null }
  } catch {
    return initialState
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN': return { ...state, user: action.payload, trips: [], erroViagens: '' }
    case 'LOGOUT': return { ...initialState }
    case 'LOAD_TRIPS_START': return { ...state, carregandoViagens: true, erroViagens: '' }
    case 'LOAD_TRIPS_SUCCESS': return { ...state, carregandoViagens: false, trips: action.payload }
    case 'LOAD_TRIPS_ERROR': return { ...state, carregandoViagens: false, trips: [], erroViagens: action.payload }
    case 'ADD_TRIP': return { ...state, trips: [action.payload, ...state.trips], mensagemViagens: 'Viagem anotada na sua agenda.' }
    case 'UPDATE_TRIP': return { ...state, trips: state.trips.map((trip) => trip.id === action.payload.id ? action.payload : trip), mensagemViagens: 'Mudanças guardadas.' }
    case 'DELETE_TRIP': return { ...state, trips: state.trips.filter((trip) => trip.id !== action.payload), mensagemViagens: 'Viagem removida da agenda.' }
    case 'CLEAR_MESSAGE': return { ...state, mensagemViagens: '' }
    default: return state
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, getInitialState)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ user: state.user }))
  }, [state.user])

  useEffect(() => {
    if (!state.user) return undefined

    let active = true
    dispatch({ type: 'LOAD_TRIPS_START' })
    travelService.listTrips(state.user.id)
      .then((trips) => {
        if (active) dispatch({ type: 'LOAD_TRIPS_SUCCESS', payload: trips })
      })
      .catch(() => {
        if (active) dispatch({ type: 'LOAD_TRIPS_ERROR', payload: 'Confira se a API e o banco estão funcionando.' })
      })

    return () => { active = false }
  }, [state.user])

  useEffect(() => {
    if (!state.mensagemViagens) return undefined
    const timer = window.setTimeout(() => dispatch({ type: 'CLEAR_MESSAGE' }), 3500)
    return () => window.clearTimeout(timer)
  }, [state.mensagemViagens])

  const value = useMemo(() => ({
    ...state,
    findUser: travelService.identifyUser,
    login(user) { dispatch({ type: 'LOGIN', payload: user }) },
    async registerUser(user) {
      const created = await travelService.registerUser(user)
      dispatch({ type: 'LOGIN', payload: created })
      return created
    },
    logout() { dispatch({ type: 'LOGOUT' }) },
    async recarregarViagens() {
      if (!state.user) return
      dispatch({ type: 'LOAD_TRIPS_START' })
      try {
        const trips = await travelService.listTrips(state.user.id)
        dispatch({ type: 'LOAD_TRIPS_SUCCESS', payload: trips })
      } catch {
        dispatch({ type: 'LOAD_TRIPS_ERROR', payload: 'Confira se a API e o banco estão funcionando.' })
      }
    },
    async addTrip(trip) {
      const created = await travelService.createTrip(state.user.id, trip)
      dispatch({ type: 'ADD_TRIP', payload: created })
      return created
    },
    async editTrip(tripId, trip) {
      const updated = await travelService.updateTrip(tripId, trip)
      dispatch({ type: 'UPDATE_TRIP', payload: updated })
      return updated
    },
    async removeTrip(tripId) {
      await travelService.deleteTrip(tripId)
      dispatch({ type: 'DELETE_TRIP', payload: tripId })
    },
  }), [state])

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
