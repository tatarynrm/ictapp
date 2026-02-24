export default function Settings() {
  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-slate-800">Налаштування профілю</h1>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Назва організації</label>
          <input
            type="text"
            defaultValue="ICTAPP Tender Platform"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Email для сповіщень</label>
          <input
            type="email"
            placeholder="admin@test.com"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>

        <div className="pt-4 border-t border-slate-100">
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 text-blue-600" defaultChecked />
            <span className="text-slate-700">Автоматично перевіряти оновлення</span>
          </label>
        </div>

        <button className="w-full bg-slate-900 text-white py-3 rounded-lg font-semibold hover:bg-black transition-colors">
          Зберегти зміни
        </button>
      </div>
    </div>
  );
}
