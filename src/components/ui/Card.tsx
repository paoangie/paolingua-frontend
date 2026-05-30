import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        group relative overflow-hidden rounded-3xl border border-slate-200
        bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.07)]
        transition-all duration-300
        ${
          onClick
            ? 'cursor-pointer hover:-translate-y-1 hover:border-teal-200 hover:shadow-[0_24px_60px_rgba(15,23,42,0.12)]'
            : ''
        }
        ${className}
      `}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-slate-950 via-teal-700 to-slate-700 opacity-90" />

      <div className="pointer-events-none absolute -right-20 -top-20 h-36 w-36 rounded-full bg-teal-50 blur-3xl transition-all duration-300 group-hover:bg-teal-100" />

      <div className="relative z-10">{children}</div>
    </div>
  )
}