import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavigationContext } from './navigation-context'

export function NavigationProvider({ children }) {
  const [pathname, setPathname] = useState(() => window.location.pathname)

  useEffect(() => {
    function handlePopState() { setPathname(window.location.pathname) }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const navigate = useCallback((to, options = {}) => {
    if (to === window.location.pathname) return
    window.history[options.replace ? 'replaceState' : 'pushState']({}, '', to)
    setPathname(window.location.pathname)
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const value = useMemo(() => ({ pathname, navigate }), [navigate, pathname])
  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>
}
