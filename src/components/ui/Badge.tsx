import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type BadgeVariant = 'default' | 'accent' | 'forest' | 'outline' | 'light'

const variants: Record<BadgeVariant, string> = {
  default: 'bg-ink text-paper',
  accent: 'bg-accent text-[#FFF9F2]',
  forest: 'bg-forest text-paper',
  outline: 'border border-ink/25 bg-transparent text-ink',
  light: 'bg-cream text-ink',
}

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[10px] font-medium uppercase leading-none tracking-[0.12em]',
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
