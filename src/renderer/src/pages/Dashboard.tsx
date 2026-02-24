import { useModal } from "@renderer/context/ModalContext";
import { useEffect } from "react";

export default function Dashboard({ onLogout }) {
const {showModal} = useModal()
  useEffect(() => {
  const { electron } = window as any;

  electron.ipcRenderer.on('update-progress', (_: any, percent: number) => {
    // Використовуй свій ModalContext для відображення прогресу
    showModal('Оновлення', `Завантаження: ${Math.round(percent)}%`, 'info');
  });

  electron.ipcRenderer.on('update-ready', () => {
    showModal('Оновлення готове', 'Програма перезапуститься для встановлення', 'success');
    setTimeout(() => {
      electron.ipcRenderer.send('install-update');
    }, 3000);
  });
}, []);
  return (
    <div className="flex w-full min-h-screen  flex-col items-center justify-center bg-slate-50">
      <h1 className="mb-4 text-3xl font-bold text-slate-800">Головна панель (Dashboard)</h1>
      <p className="mb-6 text-slate-600">Тут згодом буде статистика тендерів та бокове меню.</p>
      <button
        onClick={onLogout}
        className="rounded-lg bg-red-500 px-6 py-2 font-medium text-white hover:bg-red-600"
      >
        Вийти
      </button>
    </div>
  );
}
