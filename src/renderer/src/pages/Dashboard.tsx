export default function Dashboard({ onLogout }) {
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
