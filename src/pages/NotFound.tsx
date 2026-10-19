import { Link } from 'react-router-dom'
import { ArrowLeft, Compass } from 'lucide-react'
import { Button, buttonStyles } from '@/components/ui'
import { usePageTitle } from '@/lib/hooks'

export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <div className="container-shell flex min-h-[62vh] flex-col items-center justify-center py-24 text-center">
      <Compass className="h-8 w-8 text-accent" strokeWidth={1.25} aria-hidden="true" />
      <p className="eyebrow mt-6">Error 404</p>
      <h1 className="display-1 mt-4">Lost the trail.</h1>
      <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
        The page you were looking for has wandered off. The coffee, thankfully, has not.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link to="/shop" className={buttonStyles({ size: 'md' })}>
          Browse the shop
        </Link>
        <Link to="/" className={buttonStyles({ variant: 'outline', size: 'md' })}>
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back home
        </Link>
      </div>
      <div className="mt-10 text-[11px] uppercase tracking-[0.18em] text-muted">
        Or try our bestseller — Ethiopia Guji Uraga
      </div>
      <Link to="/product/ethiopia-guji" className="mt-3">
        <Button variant="accent" size="sm">
          Shop the bestseller
        </Button>
      </Link>
    </div>
  )
}
