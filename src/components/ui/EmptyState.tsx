import type { ComponentType, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface EmptyStateProps {
  icon?: ComponentType<{ className?: string; strokeWidth?: number }>
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center px-6 py-16 text-center', className)}>
      {Icon ? (
        <span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-ink/10 bg-surface text-ink/60">
          <Icon className="h-6 w-6" strokeWidth={1.5} />
        </span>
      ) : null}
      <h3 className="font-display text-xl">{title}</h3>
      {description ? <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">{description}</p> : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  )
}
