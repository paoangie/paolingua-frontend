import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'

interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: Toast['type']) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastId = 0

const toastStyles = {
  success: {
    container: 'border-teal-200 bg-teal-50 text-teal-900',
    icon: 'bg-teal-700 text-white',
    label: 'Correcto',
  },
  error: {
    container: 'border-red-200 bg-red-50 text-red-900',
    icon: 'bg-red-700 text-white',
    label: 'Error',
  },
  info: {
    container: 'border-slate-200 bg-white text-slate-900',
    icon: 'bg-slate-950 text-white',
    label: 'Información',
  },
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback(
    (message: string, type: Toast['type'] = 'info') => {
      const id = ++toastId

      setToasts((prev) => [...prev, { id, message, type }])

      setTimeout(() => {
        removeToast(id)
      }, 4000)
    },
    [removeToast]
  )

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast }}>
      {children}

      <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => {
          const styles = toastStyles[toast.type]

          return (
            <button
              key={toast.id}
              type="button"
              onClick={() => removeToast(toast.id)}
              className={`
                group overflow-hidden rounded-3xl border p-0 text-left
                shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_24px_60px_rgba(15,23,42,0.20)]
                ${styles.container}
              `}
            >
              <div className="flex items-start gap-4 px-5 py-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black ${styles.icon}`}
                >
                  {toast.type === 'success'
                    ? 'OK'
                    : toast.type === 'error'
                      ? '!'
                      : 'i'}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-wide opacity-70">
                    {styles.label}
                  </p>

                  <p className="mt-1 text-sm font-semibold leading-5">
                    {toast.message}
                  </p>
                </div>

                <span className="text-lg font-bold opacity-40 transition-opacity group-hover:opacity-70">
                  ×
                </span>
              </div>

              <div className="h-1 w-full bg-black/5">
                <div className="h-full w-full origin-left animate-[toastProgress_4s_linear_forwards] bg-current opacity-35" />
              </div>
            </button>
          )
        })}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }

  return context
}