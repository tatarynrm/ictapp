import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  return (
    <div className="flex w-full min-h-screen bg-slate-100 overflow-hidden text-slate-900">
      <Sidebar onLogout={onLogout} />
      <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative">
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
