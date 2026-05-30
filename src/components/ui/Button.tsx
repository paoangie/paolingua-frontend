import type { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'gold'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  children: ReactNode
}

const variants = {
  primary:
    'bg-gradient-to-r from-slate-950 to-teal-800 text-white shadow-lg shadow-slate-900/20 hover:from-slate-900 hover:to-teal-900 focus:ring-teal-600',

  secondary:
    'bg-slate-700 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800 focus:ring-slate-500',

  outline:
    'border border-slate-300 bg-white text-slate-800 shadow-sm hover:border-teal-600 hover:bg-teal-50 hover:text-teal-900 focus:ring-teal-600',

  ghost:
    'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-950 focus:ring-slate-500',

  danger:
    'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/20 hover:from-red-700 hover:to-rose-700 focus:ring-red-500',

  gold:
    'bg-gradient-to-r from-teal-700 to-slate-950 text-white shadow-lg shadow-teal-900/20 hover:from-teal-800 hover:to-slate-950 focus:ring-teal-600',
}

const sizes = {
  sm: 'px-3.5 py-2 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 rounded-2xl
        font-bold tracking-tight transition-all duration-300
        focus:outline-none focus:ring-4 focus:ring-offset-2
        disabled:cursor-not-allowed disabled:opacity-60
        active:scale-[0.98]
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />

          <path
            className="opacity-80"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.37 0 0 5.37 0 12h4z"
          />
        </svg>
      )}

      <span>{children}</span>
    </button>
  )
}