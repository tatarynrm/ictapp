import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { TrendingUp, Users, Activity, Download, Filter } from 'lucide-react';

const data = [
  { name: 'Січ', tenders: 400, revenue: 2400 },
  { name: 'Лют', tenders: 300, revenue: 1398 },
  { name: 'Бер', tenders: 200, revenue: 9800 },
  { name: 'Квіт', tenders: 278, revenue: 3908 },
  { name: 'Трав', tenders: 189, revenue: 4800 },
  { name: 'Черв', tenders: 239, revenue: 3800 },
  { name: 'Лип', tenders: 349, revenue: 4300 },
];

export default function Analytics() {
  return (
    // Головний контейнер з можливістю скролу та відступом знизу
    <div className="h-full flex flex-col space-y-8 animate-in fade-in duration-700 pb-10">

      {/* Header сторінки */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Аналітика системи</h1>
          <p className="text-slate-500 text-sm">Звіт по активності тендерної платформи ICTAPP</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors">
            <Filter size={16} /> Фільтри
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 rounded-lg text-sm font-medium text-white hover:bg-black transition-colors shadow-md">
            <Download size={16} /> Експорт
          </button>
        </div>
      </div>

      {/* Grid з картками (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Активні тендери', val: '1,284', icon: <TrendingUp />, color: 'blue' },
          { label: 'Нові постачальники', val: '+48', icon: <Users />, color: 'green' },
          { label: 'Конверсія', val: '24.5%', icon: <Activity />, color: 'purple' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`p-3 bg-${item.color}-50 text-${item.color}-600 rounded-xl`}>
                {item.icon}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
                <h3 className="text-2xl font-bold text-slate-800">{item.val}</h3>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Перший ряд графіків */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Динаміка тендерів */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Потік заявок</h3>
            <p className="text-sm text-slate-400">Кількість нових тендерів за місяць</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="tenders" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#chartColor)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Дохід */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-800">Фінансові показники</h3>
            <p className="text-sm text-slate-400">Об'єм транзакцій через платформу</p>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="revenue" fill="#0f172a" radius={[6, 6, 0, 0]} barSize={35} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Другий ряд (Великий графік для скролу) */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
        <div className="mb-6">
          <h3 className="text-lg font-bold text-slate-800">Прогнозоване зростання</h3>
          <p className="text-sm text-slate-400">Аналіз ефективності за останні пів року</p>
        </div>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
              <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
              <Bar dataKey="revenue" radius={[0, 6, 6, 0]} barSize={25}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3b82f6' : '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
