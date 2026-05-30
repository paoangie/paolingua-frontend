import { useEffect, type ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Cerrar modal"
        className="absolute inset-0 bg-slate-950/65 backdrop-blur-sm"
        onClick={onClose}
      />

      <div
        className="
          relative z-10 w-full max-w-md overflow-hidden rounded-[2rem]
          border border-white/80 bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.30)]
        "
      >
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-slate-950 via-teal-700 to-slate-700" />

        <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-teal-100/70 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-slate-200/70 blur-3xl" />

        <div className="relative">
          {title && (
            <div className="mb-6 text-center">
              <h3 className="text-xl font-black tracking-tight text-slate-950">
                {title}
              </h3>
            </div>
          )}

          {children}
        </div>
      </div>
    </div>
  )
}