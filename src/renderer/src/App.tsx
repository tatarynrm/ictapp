import { JSX, useState } from 'react'
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query' // ДОДАНО
import { ReactQueryDevtools } from '@tanstack/react-query-devtools' // ДОДАНО
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import { ModalProvider } from './context/ModalContext'

// Створюємо клієнт для кешування
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true, // Ідеально для десктопу
      staleTime: 1000 * 60 * 5, // Дані вважаються "свіжими" 5 хвилин
      retry: 1, // Кількість спроб повторного запиту при помилці
    },
  },
})

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />
    }
    return children
  }

  return (
    // Додаємо QueryClientProvider на самий верх
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <HashRouter>
          <Routes>
            <Route path="/login" element={<Login onLogin={() => setIsAuthenticated(true)} />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard onLogout={() => setIsAuthenticated(false)} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ModalProvider>

      {/* Кнопка DevTools з'явиться внизу екрану тільки в режимі розробки */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
