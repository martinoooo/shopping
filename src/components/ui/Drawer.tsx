import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBodyScrollLock, useEscapeKey } from '@/lib/hooks'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  ariaLabel?: string
  children: ReactNode
  footer?: ReactNode
  side?: 'right' | 'left'
  className?: string
  hideHeader?: boolean
}

export function Drawer({
  open,
  onClose,
  title,
  description,
  ariaLabel,
  children,
  footer,
  side = 'right',
  className,
  hideHeader = false,
}: DrawerProps) {
  const panelRef = useRef<HTMLDivElement | null>(null)
  const closeRef = useRef<HTMLButtonElement | null>(null)

  useBodyScrollLock(open)
  useEscapeKey(onClose, open)

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    const timer = window.setTimeout(() => closeRef.current?.focus(), 60)
    return () => {
      window.clearTimeout(timer)
      previous?.focus?.()
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const node = panelRef.current
    if (!node) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab') return
      const focusable = node.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open])

  if (!open) return null

  return createPortal(
    <div className="fixed inset-0 z-[90]">
      <button
        type="button"
        aria-label="Close panel"
        onClick={onClose}
        className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px] animate-fade-in"
        tabIndex={-1}
      />
      <aside
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title ?? 'Panel'}
        className={cn(
          'absolute top-0 flex h-full w-full max-w-[440px] flex-col bg-paper shadow-[-24px_0_60px_-24px_rgba(27,24,21,0.35)]',
          side === 'right' ? 'right-0 animate-slide-in-right' : 'left-0 animate-slide-in-left',
          className,
        )}
      >
        {!hideHeader ? (
          <header className="flex items-start justify-between gap-4 border-b border-ink/10 px-5 py-5 sm:px-6">
            <div>
              {title ? <h2 className="font-display text-xl leading-tight">{title}</h2> : null}
              {description ? <p className="mt-1 text-[13px] text-muted">{description}</p> : null}
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="-mr-2 -mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </header>
        ) : null}
        <div className="flex-1 overflow-y-auto overscroll-contain">{children}</div>
        {footer ? <div className="border-t border-ink/10 bg-surface">{footer}</div> : null}
      </aside>
    </div>,
    document.body,
  )
}
