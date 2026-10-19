import { useEffect, useMemo, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowUpRight, Search, X } from 'lucide-react'
import { Modal, Price, SmartImage } from '@/components/ui'
import { getBestsellers, PRODUCTS } from '@/data/products'
import { useUIStore } from '@/store/ui'
import { cn } from '@/lib/utils'
import { matchesSearch } from './shopFilters'

const POPULAR_SEARCHES = [
  'Ethiopia',
  'Colombia',
  'Decaf',
  'Espresso',
  'Pour-over',
  'Mug',
  'Gift',
]

const BESTSELLER_RESULTS = getBestsellers(3)

function ResultMeta({ label }: { label: string }) {
  return (
    <p className="text-[9.5px] font-medium uppercase tracking-[0.18em] text-muted">{label}</p>
  )
}

export function SearchDialog() {
  const open = useUIStore((state) => state.searchOpen)
  const closeSearch = useUIStore((state) => state.closeSearch)
  const navigate = useNavigate()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [query, setQuery] = useState('')
  const [activeIndex, setActiveIndex] = useState(0)

  const results = useMemo(() => {
    if (!query.trim()) return []
    return PRODUCTS.filter((product) => matchesSearch(product, query)).slice(0, 6)
  }, [query])

  const safeIndex = results.length > 0 ? Math.min(activeIndex, results.length - 1) : 0

  useEffect(() => {
    if (!open) {
      setQuery('')
      setActiveIndex(0)
      return
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 90)
    return () => window.clearTimeout(timer)
  }, [open])

  useEffect(() => {
    setActiveIndex(0)
  }, [query])

  const openResult = (slug: string) => {
    closeSearch()
    navigate(`/product/${slug}`)
  }

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      setActiveIndex((index) => (results.length === 0 ? 0 : Math.min(results.length - 1, index + 1)))
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      setActiveIndex((index) => Math.max(0, index - 1))
    } else if (event.key === 'Enter') {
      event.preventDefault()
      const product = results[safeIndex]
      if (product) openResult(product.slug)
    }
  }

  const hasQuery = query.trim().length > 0

  return (
    <Modal open={open} onClose={closeSearch} title="Search" className="max-w-2xl">
      <div className="flex items-center gap-3 border-b border-ink/10 px-5 py-4 sm:px-6">
        <Search className="h-4 w-4 shrink-0 text-muted" strokeWidth={1.75} aria-hidden="true" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Search coffees, gear or a flavour"
          aria-label="Search products"
          autoComplete="off"
          spellCheck={false}
          className="h-9 w-full bg-transparent text-[15px] text-ink placeholder:text-muted/60 focus:outline-none"
        />
        {hasQuery ? (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              inputRef.current?.focus()
            }}
            aria-label="Clear search"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/[0.06] hover:text-ink"
          >
            <X className="h-4 w-4" aria-hidden="true" />
          </button>
        ) : null}
      </div>

      <div className="max-h-[min(56vh,480px)] overflow-y-auto overscroll-contain">
        {hasQuery ? (
          results.length > 0 ? (
            <ul className="py-2" aria-label="Search results">
              {results.map((product, index) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={closeSearch}
                    onMouseEnter={() => setActiveIndex(index)}
                    className={cn(
                      'flex items-center gap-4 px-4 py-3 transition-colors sm:px-5',
                      index === safeIndex ? 'bg-cream/70' : 'hover:bg-cream/40',
                    )}
                  >
                    <SmartImage
                      src={product.images[0]?.src ?? ''}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-14 w-14 shrink-0 rounded-[2px]"
                      sizes="56px"
                    />
                    <div className="min-w-0 flex-1">
                      <ResultMeta
                        label={[
                          product.roast ? `${product.roast} roast` : product.type,
                          product.origin,
                        ]
                          .filter(Boolean)
                          .join(' · ')}
                      />
                      <p className="mt-1 truncate font-display text-[17px] leading-snug text-ink">
                        {product.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[12px] text-muted">
                        {product.category === 'coffee' && product.notes?.length
                          ? product.notes.join(' · ')
                          : product.tagline}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <Price value={product.price} size="sm" />
                      <ArrowUpRight className="h-4 w-4 text-muted" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-6 py-12 text-center">
              <p className="font-display text-xl text-ink">
                No matches for &ldquo;{query.trim()}&rdquo;
              </p>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
                Try an origin, a roast or a piece of gear — or browse everything in the shop.
              </p>
              <Link
                to="/shop"
                onClick={closeSearch}
                className="mt-5 inline-flex h-10 items-center justify-center rounded-full border border-ink/20 px-5 text-[13px] font-medium text-ink transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                Browse all products
              </Link>
            </div>
          )
        ) : (
          <div className="px-5 pb-6 pt-5 sm:px-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Popular searches
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="h-9 rounded-full border border-ink/15 bg-surface px-3.5 text-[12px] text-ink transition-colors hover:border-ink/40 hover:bg-cream/60"
                >
                  {term}
                </button>
              ))}
            </div>

            <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.18em] text-muted">
              Popular right now
            </p>
            <ul className="mt-2">
              {BESTSELLER_RESULTS.map((product) => (
                <li key={product.id}>
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={closeSearch}
                    className="group flex items-center gap-4 border-t border-ink/10 py-3 transition-colors first:border-t-0"
                  >
                    <SmartImage
                      src={product.images[0]?.src ?? ''}
                      alt={product.images[0]?.alt ?? product.name}
                      className="h-12 w-12 shrink-0 rounded-[2px]"
                      sizes="48px"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-[15px] leading-snug text-ink transition-colors group-hover:text-accent">
                        {product.name}
                      </p>
                      <p className="mt-0.5 line-clamp-1 text-[11.5px] text-muted">
                        {product.tagline}
                      </p>
                    </div>
                    <Price value={product.price} size="sm" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-ink/10 px-5 py-3 sm:px-6">
        <p className="text-[11px] text-muted" aria-live="polite">
          {hasQuery
            ? `${results.length} ${results.length === 1 ? 'result' : 'results'}`
            : 'Search the whole shop'}
        </p>
        <p className="hidden text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
          ↑↓ to navigate · Enter to open · Esc to close
        </p>
      </div>
    </Modal>
  )
}
