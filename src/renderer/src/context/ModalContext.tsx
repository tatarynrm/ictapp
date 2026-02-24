import { createContext, useState, useContext, ReactNode } from 'react'

// 1. Описуємо типи для нашого контексту
type ModalType = 'info' | 'error' | 'success' | 'warning';

interface ModalContent {
  title: string;
  message: string;
  type: ModalType;
}

interface ModalContextType {
  showModal: (title: string, message: string, type?: ModalType) => void;
  closeModal: () => void;
}

// 2. Створюємо контекст (додаємо тип та undefined як дефолтне значення)
const ModalContext = createContext<ModalContextType | undefined>(undefined)

// 3. Кастомний хук (додаємо перевірку, щоб TS не сварився на можливий undefined)
export const useModal = () => {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}

// Типізуємо пропси Провайдера
interface ModalProviderProps {
  children: ReactNode;
}

// 4. Провайдер
export const ModalProvider = ({ children }: ModalProviderProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [content, setContent] = useState<ModalContent>({
    title: '',
    message: '',
    type: 'info'
  })

  // Функція для виклику модалки
  const showModal = (title: string, message: string, type: ModalType = 'info') => {
    setContent({ title, message, type })
    setIsOpen(true)
  }

  const closeModal = () => setIsOpen(false)

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {/* UI Модалки */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity">
          <div className="w-full max-w-sm transform rounded-xl border border-slate-700 bg-slate-800 p-6 shadow-2xl transition-all">
            <h3 className={`mb-2 text-xl font-bold
              ${content.type === 'error' ? 'text-red-400' : ''}
              ${content.type === 'success' ? 'text-green-400' : ''}
              ${content.type === 'warning' ? 'text-yellow-400' : ''}
              ${content.type === 'info' ? 'text-blue-400' : ''}
            `}>
              {content.title}
            </h3>
            <p className="mb-6 text-slate-300">{content.message}</p>
            <div className="flex justify-end">
              <button
                onClick={closeModal}
                className="rounded-lg bg-slate-700 px-5 py-2 font-medium text-white transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-500"
              >
                Зрозуміло
              </button>
            </div>
          </div>
        </div>
      )}
    </ModalContext.Provider>
  )
}
