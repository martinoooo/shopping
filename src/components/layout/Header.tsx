import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react'
import { Logo } from './Logo'
import { AnnouncementBar } from './AnnouncementBar'
import { NAV_LINKS } from '@/lib/site'
import { useUIStore } from '@/store/ui'
import { useCartCount, useCartStore } from '@/store/cart'
import { useWishlistCount } from '@/store/wishlist'
import { useBodyScrollLock, useEscapeKey } from '@/lib/hooks'
import { cn } from '@/lib/utils'

function isLinkActive(current: string, to: string): boolean {
  if (to === '/shop') return current === '/shop'
  if (to.startsWith('/shop?')) return current === to
  if (to.startsWith('/#')) return false
  return current === to
}

export function Header() {
  const location = useLocation()
  const openSearch = useUIStore((state) => state.openSearch)
  const openCart = useCartStore((state) => state.openCart)
  const cartCount = useCartCount()
  const wishlistCount = useWishlistCount()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const current = `${location.pathname}${location.search}`

  useBodyScrollLock(menuOpen)
  useEscapeKey(() => setMenuOpen(false), menuOpen)

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname, location.search])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        openSearch()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openSearch])

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
      >
        Skip to content
      </a>
      <AnnouncementBar />
      <header
        className={cn(
          'sticky top-0 z-40 border-b transition-[background-color,border-color,box-shadow] duration-300',
          scrolled
            ? 'border-ink/10 bg-paper/92 shadow-[0_1px_24px_-12px_rgba(27,24,21,0.18)] backdrop-blur-md'
            : 'border-transparent bg-paper',
        )}
      >
        <div className="container-shell flex h-16 items-center justify-between gap-4 lg:h-[76px]">
          {/* Mobile: menu */}
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] lg:hidden"
            aria-label="Open menu"
            aria-expanded={menuOpen}
          >
            <Menu className="h-5 w-5" strokeWidth={1.75} aria-hidden="true" />
          </button>

          <div className="flex flex-1 justify-center lg:flex-none lg:justify-start">
            <Logo showTagline={false} />
          </div>

          <nav className="hidden items-center gap-8 lg:flex" aria-label="Primary">
            {NAV_LINKS.map((link) => {
              const active = isLinkActive(current, link.to)
              return (
                <Link
                  key={link.label}
                  to={link.to}
                  data-active={active}
                  className={cn(
                    'link-underline text-[13px] font-medium tracking-[0.01em] transition-colors duration-200',
                    active ? 'text-accent' : 'text-ink/75 hover:text-ink',
                  )}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          <div className="flex flex-1 items-center justify-end gap-0.5 sm:gap-1">
            <button
              type="button"
              onClick={openSearch}
              className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
              aria-label="Search products"
              aria-keyshortcuts="Control+K Meta+K"
            >
              <Search className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
            </button>
            <Link
              to="/wishlist"
              className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06] sm:flex"
              aria-label={`Saved items${wishlistCount ? `, ${wishlistCount}` : ''}`}
            >
              <Heart className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
              {wishlistCount > 0 ? (
                <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold text-[#FFF9F2]">
                  {wishlistCount}
                </span>
              ) : null}
            </Link>
            <button
              type="button"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink transition-colors hover:bg-ink/[0.06]"
              aria-label={`Open cart${cartCount ? `, ${cartCount} items` : ''}`}
            >
              <ShoppingBag className="h-[19px] w-[19px]" strokeWidth={1.75} aria-hidden="true" />
              {cartCount > 0 ? (
                <span className="absolute right-0.5 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[9px] font-semibold tabular-nums text-[#FFF9F2]">
                  {cartCount}
                </span>
              ) : null}
            </button>
          </div>
        </div>
      </header>

      {menuOpen ? (
        <div className="fixed inset-0 z-[88] flex flex-col bg-paper lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="flex h-16 items-center justify-between border-b border-ink/10 px-5">
            <Logo showTagline={false} />
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="-mr-2 flex h-10 w-10 items-center justify-center rounded-full text-ink hover:bg-ink/[0.06]"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-5 py-8" aria-label="Mobile">
            <ul className="space-y-1">
              {NAV_LINKS.map((link, index) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="flex items-baseline justify-between border-b border-ink/10 py-4 font-display text-[26px] leading-none text-ink"
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                    <span className="text-[10px] tabular-nums tracking-[0.2em] text-muted">
                      0{index + 1}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-10 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => {
                  setMenuOpen(false)
                  openSearch()
                }}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 text-sm"
              >
                <Search className="h-4 w-4" aria-hidden="true" /> Search
              </button>
              <Link
                to="/wishlist"
                onClick={() => setMenuOpen(false)}
                className="flex h-12 items-center justify-center gap-2 rounded-full border border-ink/15 text-sm"
              >
                <Heart className="h-4 w-4" aria-hidden="true" /> Saved
                {wishlistCount > 0 ? <span className="tabular-nums text-muted">({wishlistCount})</span> : null}
              </Link>
            </div>

            <div className="mt-12 space-y-2 text-[13px] text-muted">
              <p>Free U.S. shipping over $60</p>
              <p>Roasted to order every Tuesday</p>
              <a href="mailto:hello@emberandoak.coffee" className="link-underline text-ink">
                hello@emberandoak.coffee
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  )
}
