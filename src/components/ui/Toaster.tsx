import { useEffect } from 'react'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'
import type { Toast } from '@/store/ui'

const toneIcon = {
  default: Info,
  success: CheckCircle2,
  error: AlertCircle,
} as const

function ToastItem({ toast, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  const Icon = toneIcon[toast.tone]

  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(toast.id), 4000)
    return () => window.clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto flex w-full max-w-sm animate-toast-in items-start gap-3 rounded-[3px] px-4 py-3.5 shadow-[0_16px_40px_-12px_rgba(27,24,21,0.4)]',
        toast.tone === 'error' ? 'bg-[#5C2116] text-[#FFF6EF]' : 'bg-ink text-paper',
      )}
    >
      <Icon
        className={cn(
          'mt-0.5 h-4 w-4 shrink-0',
          toast.tone === 'success' ? 'text-[#D9B98C]' : toast.tone === 'error' ? 'text-[#F0B49B]' : 'text-paper/70',
        )}
        aria-hidden="true"
      />
      <div className="min-w-0 flex-1">
        <p className="text-[13px] font-medium leading-snug">{toast.title}</p>
        {toast.description ? (
          <p className="mt-0.5 text-[12px] leading-snug text-paper/65">{toast.description}</p>
        ) : null}
      </div>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="-mr-1 -mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-paper/50 transition-colors hover:bg-paper/10 hover:text-paper"
        aria-label="Dismiss notification"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  )
}

export function Toaster() {
  const toasts = useUIStore((state) => state.toasts)
  const dismissToast = useUIStore((state) => state.dismissToast)

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[120] flex flex-col items-center gap-2 sm:inset-x-auto sm:bottom-6 sm:right-6 sm:items-end">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={dismissToast} />
      ))}
    </div>
  )
}
