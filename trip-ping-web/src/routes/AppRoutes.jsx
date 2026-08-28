import { useEffect } from 'react'
import { useApp } from '../context/useApp'
import { useNavigation } from '../navigation/useNavigation'
import { AgendaPage } from '../pages/AgendaPage/AgendaPage'
import { IdentificationPage } from '../pages/IdentificationPage/IdentificationPage'
import { LandingPage } from '../pages/LandingPage/LandingPage'

export function AppRoutes() {
  const { user } = useApp()
  const { pathname, navigate } = useNavigation()
  const knownPath = ['/', '/identificar', '/viagens'].includes(pathname)
  const protectedWithoutUser = pathname === '/viagens' && !user

  useEffect(() => {
    if (!knownPath) navigate('/', { replace: true })
    else if (protectedWithoutUser) navigate('/identificar', { replace: true })
  }, [knownPath, navigate, protectedWithoutUser])

  if (!knownPath || protectedWithoutUser) return null
  if (pathname === '/identificar') return <IdentificationPage />
  if (pathname === '/viagens') return <AgendaPage />
  return <LandingPage />
}
