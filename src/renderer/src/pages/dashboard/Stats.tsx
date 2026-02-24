export default function Stats() {
  const cards = [
    { title: 'Активні тендери', value: '12', color: 'text-blue-600', icon: '📁' },
    { title: 'Завершено', value: '45', color: 'text-green-600', icon: '✅' },
    { title: 'Всього витрачено', value: '125,400 ₴', color: 'text-slate-800', icon: '💰' },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Аналітика системи</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="p-6 bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-2xl">{card.icon}</span>
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Live</span>
            </div>
            <h3 className="text-slate-500 font-medium">{card.title}</h3>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 h-64 flex items-center justify-center">
        <p className="text-slate-400 italic">Тут буде графік активності (Chart.js / Recharts)</p>
      </div>
    </div>
  );
}
