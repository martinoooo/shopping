import type { InputHTMLAttributes, SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

const errorTextClass = 'mt-1.5 text-[12px] leading-snug text-[#8F3A1D]'
const invalidFieldClass = 'border-[#8F3A1D]/60 focus:border-[#8F3A1D]'

interface FieldLabelProps {
  id: string
  label: string
  optional?: boolean
}

function FieldLabel({ id, label, optional }: FieldLabelProps) {
  return (
    <label htmlFor={id} className="field-label">
      {label}
      {optional ? (
        <span className="ml-1.5 normal-case tracking-normal text-muted/70">(optional)</span>
      ) : null}
    </label>
  )
}

interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  containerClassName?: string
}

export function TextField({
  id,
  label,
  error,
  hint,
  optional,
  containerClassName,
  className,
  ...props
}: TextFieldProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={containerClassName}>
      <FieldLabel id={id} label={label} optional={optional} />
      <input
        {...props}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={descriptionId}
        className={cn('field', error && invalidFieldClass, className)}
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorTextClass}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}

interface SelectFieldProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'id' | 'children'> {
  id: string
  label: string
  error?: string
  hint?: string
  optional?: boolean
  containerClassName?: string
  options: ReadonlyArray<{ value: string; label: string }>
  placeholder?: string
}

export function SelectField({
  id,
  label,
  error,
  hint,
  optional,
  containerClassName,
  className,
  options,
  placeholder = 'Select an option',
  ...props
}: SelectFieldProps) {
  const descriptionId = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={containerClassName}>
      <FieldLabel id={id} label={label} optional={optional} />
      <div className="relative">
        <select
          {...props}
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={descriptionId}
          className={cn(
            'field appearance-none pr-10',
            error && invalidFieldClass,
            !props.value && 'text-muted',
            className,
          )}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          aria-hidden="true"
        />
      </div>
      {error ? (
        <p id={`${id}-error`} role="alert" className={errorTextClass}>
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1.5 text-[12px] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
