import { NavLink } from 'react-router-dom'

// Визначаємо інтерфейс для пропсів
interface SidebarProps {
  onLogout: () => void
}

export default function Sidebar({ onLogout }: SidebarProps) {
  const menuItems = [
    { path: 'stats', label: 'Статистика', icon: '📊' },
    { path: 'tenders', label: 'Тендери', icon: '📁' },
    { path: 'settings', label: 'Налаштування', icon: '⚙️' },
    { path: 'profile', label: 'Профіль', icon: '👤' },
  ]

  return (
    <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 h-full shadow-2xl min-h-screen">
      {/* Заголовок з "Drag Region" для Electron, якщо у тебе прихований titlebar */}
      <div className="p-6 text-2xl font-bold border-b border-slate-800 text-blue-400 select-none">
        ICTAPP
      </div>

      <nav className="flex-1 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={`/dashboard/${item.path}`}
            className={({ isActive }) =>
              `w-full flex items-center px-6 py-4 transition-all duration-200 group ${
                isActive
                ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <span className="mr-3 text-xl group-hover:scale-110 transition-transform">
              {item.icon}
            </span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Кнопка виходу внизу */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 py-3 font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95"
        >
          <span>🚪</span> Вийти
        </button>
      </div>
    </aside>
  )
}
