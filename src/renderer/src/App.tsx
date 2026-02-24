import { JSX, useState, useEffect, useCallback } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalProvider, useModal } from './context/ModalContext'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Stats from './pages/dashboard/Stats'
import Tenders from './pages/dashboard/Tenders'
import Settings from './pages/dashboard/Settings'
import Profile from './pages/dashboard/Profile'
import Loads from './pages/dashboard/Loads'

const queryClient = new QueryClient()

function UpdateSubscriber() {
  const { showModal } = useModal()

  useEffect(() => {
    const { electron } = window as any
    if (!electron) return

    // Фоновий статус (тільки в консоль)
    const removeStatus = electron.ipcRenderer.on('update-status', (_: any, msg: string) => {
      console.log('Updater:', msg)
    })

    // Тільки коли все готово — показуємо модалку
    const removeReady = electron.ipcRenderer.on('update-ready', () => {
      showModal(
        'Оновлення готове',
        'Нова версія завантажена. Додаток перезапуститься для оновлення за 3 секунди.',
        'success'
      )
      setTimeout(() => electron.ipcRenderer.send('install-update'), 3000)
    })

    return () => {
      removeStatus(); removeReady();
    }
  }, [showModal])

  return null
}

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const login = useCallback(() => setIsAuthenticated(true), [])
  const logout = useCallback(() => setIsAuthenticated(false), [])

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <UpdateSubscriber />
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={login} />} />

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? (
                  <DashboardLayout onLogout={logout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            >
              <Route index element={<Navigate to="stats" replace />} />
              <Route path="stats" element={<Stats />} />
              <Route path="tenders" element={<Tenders />} />
              <Route path="settings" element={<Settings />} />
              <Route path="profile" element={<Profile />} />
              <Route path="loads" element={<Loads />} />
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
