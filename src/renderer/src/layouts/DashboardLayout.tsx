import { useEffect } from 'react';
import { useModal } from '../context/ModalContext';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function DashboardLayout({ onLogout }: { onLogout: () => void }) {
  const { showModal } = useModal();

  useEffect(() => {
    const { electron } = window as any;

    const removeProgress = electron.ipcRenderer.on('update-progress', (_: any, percent: number) => {
      showModal('Оновлення', `Завантаження: ${Math.round(percent)}%`, 'info');
    });

    const removeReady = electron.ipcRenderer.on('update-ready', () => {
      showModal('Оновлення готове', 'Програма перезапуститься для встановлення', 'success');
      setTimeout(() => {
        electron.ipcRenderer.send('install-update');
      }, 3000);
    });

    return () => {
      removeProgress();
      removeReady();
    };
  }, []);

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
  );
}
