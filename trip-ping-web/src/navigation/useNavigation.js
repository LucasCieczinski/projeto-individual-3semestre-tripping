import { useContext } from 'react'
import { NavigationContext } from './navigation-context'

export function useNavigation() {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigation deve ser usado dentro de NavigationProvider.')
  return context
}
