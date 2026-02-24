import { User, Mail, Briefcase, Code, Calendar } from 'lucide-react'; // Якщо використовуєте іконки

export default function Loads() {
  const techStack = ['NestJS', 'Next.js', 'PostgreSQL', 'TypeScript', 'Electron'];

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <h1 className="text-2xl font-bold text-slate-800">Мій профіль</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Ліва колонка: Аватар та основне */}
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 flex flex-col items-center text-center">
          <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold mb-4 border-4 border-white shadow-sm">
            RT
          </div>
          <h2 className="text-xl font-bold text-slate-800">Full-stack Developer</h2>
          <p className="text-slate-500 text-sm mb-4">Lviv, Ukraine</p>
          <div className="flex gap-2 w-full mt-4">
             <button className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
               Редагувати
             </button>
          </div>
        </div>

        {/* Права колонка: Деталі */}
        <div className="md:col-span-2 space-y-6">
          {/* Секція: Особиста інформація */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <User size={20} className="text-blue-500" /> Основна інформація
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Пошта</label>
                <div className="text-slate-700 flex items-center gap-2">
                  <Mail size={16} /> admin@test.com
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Спеціалізація</label>
                <div className="text-slate-700 flex items-center gap-2">
                  <Briefcase size={16} /> Web & Desktop Development
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Досвід</label>
                <div className="text-slate-700 flex items-center gap-2">
                  <Calendar size={16} /> Full-stack Developer
                </div>
              </div>
            </div>
          </div>

          {/* Секція: Стек технологій */}
          <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Code size={20} className="text-blue-500" /> Технічний стек
            </h3>
            <div className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium border border-slate-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
