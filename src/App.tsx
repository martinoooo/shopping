import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { SearchDialog } from '@/components/catalog/SearchDialog'
import { Toaster } from '@/components/ui'
import { useUIStore } from '@/store/ui'
import Home from '@/pages/Home'
import Shop from '@/pages/Shop'
import Product from '@/pages/Product'
import Checkout from '@/pages/Checkout'
import OrderConfirmation from '@/pages/OrderConfirmation'
import Wishlist from '@/pages/Wishlist'
import NotFound from '@/pages/NotFound'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1))
      if (target) {
        const timer = window.setTimeout(
          () => target.scrollIntoView({ behavior: 'smooth', block: 'start' }),
          80,
        )
        return () => window.clearTimeout(timer)
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname, hash])

  return null
}

export default function App() {
  const location = useLocation()
  const dismissAllToasts = useUIStore((state) => state.dismissAllToasts)

  useEffect(() => {
    dismissAllToasts()
  }, [location.pathname, location.search, dismissAllToasts])

  return (
    <div className="grain flex min-h-screen flex-col bg-paper">
      <ScrollManager />
      <Header />
      <main id="main-content" className="flex-1">
        <div key={`${location.pathname}${location.search}`} className="animate-fade-in">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:slug" element={<Product />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order/:orderId" element={<OrderConfirmation />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <SearchDialog />
      <Toaster />
    </div>
  )
}
