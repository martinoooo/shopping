import { Link } from 'react-router-dom'
import { Trash2 } from 'lucide-react'
import type { CartLine } from '@/lib/types'
import { Badge, Price, QtyStepper, SmartImage } from '@/components/ui'
import { useCartStore } from '@/store/cart'
import { useToast } from '@/store/ui'
import { formatMoney } from '@/lib/utils'

interface CartLineItemProps {
  line: CartLine
}

/** A single editable row inside the cart drawer. */
export function CartLineItem({ line }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity)
  const removeLine = useCartStore((state) => state.removeLine)
  const closeCart = useCartStore((state) => state.closeCart)
  const pushToast = useToast()

  const subscribed = line.purchaseType === 'subscribe'
  const options = line.grind ? `${line.size} · ${line.grind}` : line.size
  const lineTotal = line.unitPrice * line.quantity

  const onRemove = () => {
    removeLine(line.lineId)
    pushToast({
      title: 'Removed from your bag',
      description: line.name,
      tone: 'default',
    })
  }

  return (
    <li className="flex gap-4 py-5">
      <Link
        to={`/product/${line.slug}`}
        onClick={closeCart}
        className="shrink-0 focus-visible:outline-none"
        aria-label={`View ${line.name}`}
        tabIndex={-1}
      >
        <SmartImage
          src={line.image}
          alt={line.name}
          className="h-[96px] w-[76px] rounded-[2px]"
          sizes="76px"
        />
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="font-display text-[15px] leading-snug text-ink">
              <Link
                to={`/product/${line.slug}`}
                onClick={closeCart}
                className="transition-colors hover:text-accent"
              >
                {line.name}
              </Link>
            </p>
            <p className="mt-1 text-[10.5px] uppercase tracking-[0.14em] text-muted">{options}</p>
            {subscribed ? (
              <Badge variant="forest" className="mt-1.5">
                Subscribe · {line.cadence ?? 'Recurring'}
              </Badge>
            ) : null}
          </div>

          <div className="shrink-0 text-right">
            <Price value={line.unitPrice} compareAt={subscribed ? line.listPrice : undefined} size="sm" />
            {line.quantity > 1 ? (
              <p className="mt-1 text-[11px] tabular-nums text-muted">{formatMoney(lineTotal)} total</p>
            ) : null}
          </div>
        </div>

        <div className="mt-auto flex items-center justify-between gap-2 pt-3">
          <QtyStepper
            value={line.quantity}
            max={line.maxQuantity}
            label={`Quantity for ${line.name}`}
            className="h-12"
            onChange={(quantity) => updateQuantity(line.lineId, quantity)}
          />

          <div className="flex items-center">
            <Link
              to={`/product/${line.slug}`}
              onClick={closeCart}
              className="flex h-11 items-center px-2 text-[12px] text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={onRemove}
              aria-label={`Remove ${line.name} from bag`}
              className="flex h-11 w-11 items-center justify-center rounded-full text-muted transition-colors hover:bg-ink/[0.06] hover:text-accent"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.75} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
