import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: number
  message: string
  type: ToastType
}

interface ToastContextType {
  toasts: Toast[]
  addToast: (message: string, type?: ToastType) => void
  removeToast: (id: number) => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

let toastSequence = 0

function createToast(message: string, type: ToastType = 'info'): Toast {
  toastSequence += 1

  return {
    id: toastSequence,
    message,
    type,
  }
}

function getToastStyles(type: ToastType) {
  const styles: Record<ToastType, string> = {
    success:
      'border-teal-200 bg-teal-50 text-teal-900 shadow-[0_18px_45px_rgba(15,118,110,0.16)]',
    error:
      'border-red-200 bg-red-50 text-red-900 shadow-[0_18px_45px_rgba(220,38,38,0.14)]',
    info:
      'border-slate-200 bg-white text-slate-900 shadow-[0_18px_45px_rgba(15,23,42,0.12)]',
  }

  return styles[type]
}

function getToastIndicator(type: ToastType) {
  const indicators: Record<ToastType, string> = {
    success: 'bg-teal-600',
    error: 'bg-red-600',
    info: 'bg-slate-900',
  }

  return indicators[type]
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutRefs = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  )

  const removeToast = useCallback((id: number) => {
    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )

    const timeout = timeoutRefs.current.get(id)

    if (timeout) {
      clearTimeout(timeout)
      timeoutRefs.current.delete(id)
    }
  }, [])

  const addToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const toast = createToast(message, type)

      setToasts((currentToasts) => [...currentToasts, toast])

      const timeout = setTimeout(() => {
        removeToast(toast.id)
      }, 4000)

      timeoutRefs.current.set(toast.id, timeout)
    },
    [removeToast]
  )

  useEffect(() => {
    return () => {
      timeoutRefs.current.forEach((timeout) => clearTimeout(timeout))
      timeoutRefs.current.clear()
    }
  }, [])

  const value = useMemo(
    () => ({
      toasts,
      addToast,
      removeToast,
    }),
    [toasts, addToast, removeToast]
  )

  return (
    <ToastContext.Provider value={value}>
      {children}

      <div className="fixed bottom-5 right-5 z-50 flex w-[calc(100%-2.5rem)] max-w-sm flex-col gap-3">
        {toasts.map((toast) => (
          <button
            key={toast.id}
            type="button"
            onClick={() => removeToast(toast.id)}
            className={`
              group overflow-hidden rounded-3xl border px-5 py-4 text-left
              transition-all duration-300 hover:-translate-y-1
              ${getToastStyles(toast.type)}
            `}
          >
            <div className="flex items-start gap-3">
              <span
                className={`mt-1 h-3 w-3 shrink-0 rounded-full ${getToastIndicator(
                  toast.type
                )}`}
              />

              <div>
                <p className="text-sm font-bold">
                  {toast.type === 'success'
                    ? 'Operación exitosa'
                    : toast.type === 'error'
                      ? 'Ocurrió un problema'
                      : 'Información'}
                </p>

                <p className="mt-1 text-sm leading-6 opacity-80">
                  {toast.message}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider')
  }

  return context
}