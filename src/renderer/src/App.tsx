import { JSX, useState } from 'react'
import { HashRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { ModalProvider } from './context/ModalContext'
import DashboardLayout from './layouts/DashboardLayout'
import Login from './pages/Login'
import Stats from './pages/dashboard/Stats'
import Tenders from './pages/dashboard/Tenders'
import Settings from './pages/dashboard/Settings'

// Імпорт сторінок (використовуй нову структуру папок)

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
      staleTime: 1000 * 60 * 5,
      retry: 1
    }
  }
})

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Обгортка для захисту маршрутів
  const ProtectedRoute = () => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    // Outlet рендерить вкладені маршрути (дітей) всередині Layout
    return <DashboardLayout onLogout={() => setIsAuthenticated(false)} />
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <HashRouter>
          <Routes>
            {/* Публічний маршрут */}
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />

            {/* Захищений розділ з Layout */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Outlet />}>
                <Route index element={<Navigate to="stats" replace />} />
                <Route path="stats" element={<Stats />} />
                <Route path="tenders" element={<Tenders />} />
                <Route path="settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Глобальний редирект */}
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
