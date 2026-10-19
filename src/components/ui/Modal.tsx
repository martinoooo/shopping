import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useBodyScrollLock, useEscapeKey } from '@/lib/hooks'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  ariaLabel?: string
  children: ReactNode
  className?: string
  align?: 'center' | 'top'
}

export function Modal({ open, onClose, title, ariaLabel, children, className, align = 'top' }: ModalProps) {
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
    <div
      className={cn(
        'fixed inset-0 z-[95] flex justify-center overflow-y-auto p-4 sm:p-6',
        align === 'top' ? 'items-start pt-[8vh] sm:pt-[12vh]' : 'items-center',
      )}
    >
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="fixed inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-[2px] animate-fade-in"
        tabIndex={-1}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={ariaLabel ?? title ?? 'Dialog'}
        className={cn(
          'relative z-10 w-full max-w-xl animate-fade-up bg-paper shadow-[0_32px_80px_-24px_rgba(27,24,21,0.4)]',
          className,
        )}
      >
        <div className="flex items-center justify-between gap-4 border-b border-ink/10 px-5 py-4 sm:px-6">
          {title ? <h2 className="font-display text-lg">{title}</h2> : <span />}
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="-mr-2 flex h-9 w-9 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body,
  )
}
