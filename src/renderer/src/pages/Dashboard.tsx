import { useModal } from "@renderer/context/ModalContext";
import { useEffect, useState } from "react";

export default function Dashboard({ onLogout }) {
  const { showModal } = useModal();
  const [activeTab, setActiveTab] = useState('stats');

  useEffect(() => {
    const { electron } = window as any;

    // Обробка прогресу завантаження
    const removeProgress = electron.ipcRenderer.on('update-progress', (_: any, percent: number) => {
      // Виводимо повідомлення, яке оновлюється
      showModal('Оновлення', `Завантаження: ${Math.round(percent)}%`, 'info');
    });

    // Обробка готовності до встановлення
    const removeReady = electron.ipcRenderer.on('update-ready', () => {
      showModal('Оновлення готове', 'Програма перезапуститься за 3 секунди для встановлення...', 'success');
      setTimeout(() => {
        electron.ipcRenderer.send('install-update');
      }, 3000);
    });

    return () => {
      // Чистимо слухачів при виході з компонента
      removeProgress();
      removeReady();
    };
  }, []);

  const menuItems = [
    { id: 'stats', label: 'Статистика', icon: '📊' },
    { id: 'tenders', label: 'Мої Тендери', icon: '📁' },
    { id: 'search', label: 'Пошук', icon: '🔍' },
    { id: 'settings', label: 'Налаштування', icon: '⚙️' },
  ];

  return (
    <div className="flex w-full h-screen bg-slate-100 pt-10">
      {/* --- ЛІВЕ МЕНЮ (SIDEBAR) --- */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl p-4">
        <div className="p-6 text-2xl font-bold border-b border-slate-700 text-blue-400">
          ICTAPP
        </div>

        <nav className="flex-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center px-6 py-4 transition-colors ${
                activeTab === item.id
                ? 'bg-blue-600 text-white border-r-4 border-blue-300'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span className="mr-3 text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-700">
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-500/10 py-2 font-medium text-red-500 hover:bg-red-500 hover:text-white transition-all"
          >
            <span>🚪</span> Вийти
          </button>
        </div>
      </aside>

      {/* --- ПРАВА ЧАСТИНА (CONTENT) --- */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Хедер контенту */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-800">
            {menuItems.find(i => i.id === activeTab)?.label}
          </h2>
          <div className="flex items-center gap-3">
            <span className="text-sm text-slate-500">Система активна</span>
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          </div>
        </header>

        {/* Область перегляду */}
        <section className="flex-1 p-8 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-sm p-6 min-h-[400px] border border-slate-200">
            {activeTab === 'stats' && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-lg font-bold mb-4">Загальна статистика тендерів</h3>
                <p className="text-slate-600">Тут будуть графіки та аналітичні дані.</p>
              </div>
            )}
            {activeTab === 'tenders' && (
              <div className="animate-in fade-in duration-500">
                <h3 className="text-lg font-bold mb-4">Список ваших файлів</h3>
                <p className="text-slate-600">Жодного тендера поки не додано.</p>
              </div>
            )}
            {activeTab === 'search' && <div>Пошук по базі даних...</div>}
            {activeTab === 'settings' && <div>Налаштування профілю користувача.</div>}
          </div>
        </section>
      </main>
    </div>
  );
}
