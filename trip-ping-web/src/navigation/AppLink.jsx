import { useNavigation } from './useNavigation'

export function AppLink({ to, onClick, children, ...props }) {
  const { navigate } = useNavigation()

  function handleClick(event) {
    onClick?.(event)
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    event.preventDefault()
    navigate(to)
  }

  return <a href={to} onClick={handleClick} {...props}>{children}</a>
}
