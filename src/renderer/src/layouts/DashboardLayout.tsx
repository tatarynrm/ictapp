import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex w-full h-screen bg-slate-100 overflow-hidden text-slate-900">
      <Sidebar onLogout={onLogout} />

      {/* h-full тут критично важливий для координації скролу */}
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative h-full">
        {/* Саме цей div є "вікном" зі скролом. h-full + overflow-y-auto */}
        <div className="flex-1 overflow-y-auto h-full scroll-smooth">
          <div className="p-8  mx-auto min-h-full">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
