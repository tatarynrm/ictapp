import { useModal } from '@renderer/context/ModalContext'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login({ onLogin }) {
const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  // ДОДАНО: Дістаємо функцію виклику модалки
  const { showModal } = useModal()

  const handleLogin = (e) => {
    e.preventDefault()

    if (email === 'admin@test.com' && password === '123') {
      onLogin(true)
      navigate('/')
    } else {
      // ЗАМІНЕНО: Викликаємо красиву модалку замість alert
      showModal(
        'Помилка авторизації',
        'Ви ввели невірний логін або пароль. Спробуйте ще раз.',
        'error'
      )
    }
  }

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-slate-900">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-8 shadow-2xl border border-slate-700">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Вхід в Систему</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 p-2.5 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="admin@test.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-slate-300">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg bg-slate-700 border border-slate-600 p-2.5 text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-2.5 font-medium text-white transition-colors hover:bg-blue-500"
          >
            Увійти
          </button>
        </form>
      </div>
    </div>
  )
}
