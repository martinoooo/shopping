import { Link } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface LogoProps {
  tone?: 'dark' | 'light'
  className?: string
  showTagline?: boolean
}

export function Logo({ tone = 'dark', className, showTagline = true }: LogoProps) {
  return (
    <Link
      to="/"
      aria-label="Ember & Oak — home"
      className={cn('group inline-flex items-center gap-2.5', className)}
    >
      <span
        className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-300',
          tone === 'dark'
            ? 'bg-ink text-paper group-hover:bg-accent'
            : 'bg-paper text-ink group-hover:bg-accent group-hover:text-paper',
        )}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px]" aria-hidden="true">
          <ellipse
            cx="12"
            cy="12"
            rx="5.2"
            ry="8.4"
            transform="rotate(32 12 12)"
            stroke="currentColor"
            strokeWidth="1.5"
          />
          <path
            d="M8.4 8.2c2.7 1.6 4.6 4 5.6 7.1"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-col leading-none">
        <span className="whitespace-nowrap font-display text-[16px] font-normal tracking-[-0.01em] sm:text-[18px]">
          Ember <span className="text-accent">&amp;</span> Oak
        </span>
        {showTagline ? (
          <span
            className={cn(
              'mt-1 text-[8px] font-medium uppercase tracking-[0.3em]',
              tone === 'dark' ? 'text-muted' : 'text-paper/55',
            )}
          >
            Coffee Roasters
          </span>
        ) : null}
      </span>
    </Link>
  )
}
