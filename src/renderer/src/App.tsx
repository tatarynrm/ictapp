import {  useState, useEffect } from 'react' // Додано useEffect
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalProvider, useModal } from './context/ModalContext' // Додано useModal
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Stats from './pages/dashboard/Stats'
import Tenders from './pages/dashboard/Tenders'
import Settings from './pages/dashboard/Settings'
import Profile from './pages/dashboard/Profile'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
})

// Окремий компонент для логіки оновлень, щоб використовувати useModal всередині ModalProvider
function UpdateSubscriber() {
  const { showModal } = useModal()

  useEffect(() => {
    const { electron } = window as any
    if (!electron) return

    // Слухаємо статус оновлення
    const removeStatus = electron.ipcRenderer.on('update-status', (_: any, message: string) => {
      showModal('Оновлення', message, 'info')
    })

    // Слухаємо прогрес завантаження
    const removeProgress = electron.ipcRenderer.on('update-progress', (_: any, percent: number) => {
      showModal('Оновлення', `Завантаження: ${Math.round(percent)}%`, 'info')
    })

    // Слухаємо готовність до встановлення
    const removeReady = electron.ipcRenderer.on('update-ready', () => {
      showModal('Оновлення готове', 'Програма перезапуститься для встановлення за 3 секунди', 'success')

      setTimeout(() => {
        electron.ipcRenderer.send('install-update')
      }, 3000)
    })

    return () => {
      // Обов'язково чистимо підписки при демонтажі
      removeStatus()
      removeProgress()
      removeReady()
    }
  }, [showModal])

  return null // Цей компонент нічого не рендерить
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const ProtectedRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        {/* Підписуємось на оновлення всередині ModalProvider */}
        <UpdateSubscriber />

        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Outlet />}>
                <Route index element={<Navigate to="stats" replace />} />
                <Route path="stats" element={<Stats />} />
                <Route path="tenders" element={<Tenders />} />
                <Route path="settings" element={<Settings />} />
                <Route path="profile" element={<Profile />} />
              </Route>
            </Route>

            <Route
              path="*"
              element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />}
            />
          </Routes>
        </HashRouter>
      </ModalProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
