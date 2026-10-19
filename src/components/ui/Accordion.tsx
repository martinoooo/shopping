import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export interface AccordionItemData {
  id: string
  title: string
  content: ReactNode
}

interface AccordionProps {
  items: AccordionItemData[]
  defaultOpen?: string[]
  className?: string
}

export function Accordion({ items, defaultOpen = [], className }: AccordionProps) {
  return (
    <div className={cn('border-t border-ink/10', className)}>
      {items.map((item) => (
        <details
          key={item.id}
          open={defaultOpen.includes(item.id)}
          className="group border-b border-ink/10"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-sm font-medium text-ink transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
            {item.title}
            <ChevronDown
              className="h-4 w-4 shrink-0 text-muted transition-transform duration-300 group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <div className="pb-5 text-[13.5px] leading-relaxed text-muted">{item.content}</div>
        </details>
      ))}
    </div>
  )
}
