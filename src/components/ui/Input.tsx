import { forwardRef, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-2 block text-sm font-bold text-slate-700">
            {label}
          </label>
        )}

        <input
          ref={ref}
          className={`
            block w-full rounded-2xl border bg-white px-4 py-3
            text-sm font-semibold text-slate-950 shadow-sm outline-none
            transition-all duration-300
            placeholder:text-slate-400
            focus:-translate-y-0.5 focus:shadow-lg
            ${
              error
                ? 'border-red-300 focus:border-red-500 focus:ring-4 focus:ring-red-100'
                : 'border-slate-200 focus:border-teal-600 focus:ring-4 focus:ring-teal-100'
            }
            ${className}
          `}
          {...props}
        />

        {error && (
          <p className="mt-2 rounded-2xl border border-red-100 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input