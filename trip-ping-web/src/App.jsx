import { AppProvider } from './context/AppContext'
import { NavigationProvider } from './navigation/NavigationProvider'
import { AppRoutes } from './routes/AppRoutes'

function App() {
  return (
    <AppProvider>
      <NavigationProvider>
        <AppRoutes />
      </NavigationProvider>
    </AppProvider>
  )
}

export default App
