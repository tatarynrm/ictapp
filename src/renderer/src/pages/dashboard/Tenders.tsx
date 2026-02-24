export default function Tenders() {
  const dummyTenders = [
    { id: 1, name: 'Закупівля обладнання', status: 'Активний', date: '20.02.2026' },
    { id: 2, name: 'Послуги логістики', status: 'Очікування', date: '22.02.2026' },
    { id: 3, name: 'Ремонт офісу', status: 'Закрито', date: '15.01.2026' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-800">Управління тендерами</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          + Створити тендер
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 font-semibold text-slate-700">Назва</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Статус</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Дата</th>
              <th className="px-6 py-4 font-semibold text-slate-700">Дії</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {dummyTenders.map((t) => (
              <tr key={t.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-slate-800 font-medium">{t.name}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">
                    {t.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500">{t.date}</td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:underline">Редагувати</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
