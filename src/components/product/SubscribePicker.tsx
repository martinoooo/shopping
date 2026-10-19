import { CalendarDays, Check } from 'lucide-react'
import type { PurchaseType } from '@/lib/types'
import { SUBSCRIPTION_CADENCES } from '@/data/products'
import { SUBSCRIPTION_DISCOUNT } from '@/store/cart'
import { cn, formatMoney, roundCurrency } from '@/lib/utils'

interface SubscribePickerProps {
  purchaseType: PurchaseType
  onPurchaseTypeChange: (type: PurchaseType) => void
  cadence: string
  onCadenceChange: (id: string) => void
  listPrice: number
  className?: string
}

interface TypeCardProps {
  active: boolean
  title: string
  detail: string
  badge?: string
  name: string
  value: PurchaseType
  onSelect: (type: PurchaseType) => void
}

function TypeCard({ active, title, detail, badge, name, value, onSelect }: TypeCardProps) {
  return (
    <label
      className={cn(
        'relative flex cursor-pointer items-start gap-2.5 rounded-[2px] border px-3 py-3 transition-colors duration-200 focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent',
        active ? 'border-ink bg-ink/[0.045]' : 'border-ink/15 bg-surface hover:border-ink/40',
      )}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={active}
        onChange={() => onSelect(value)}
        className="sr-only"
      />
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors duration-200',
          active ? 'border-ink bg-ink text-paper' : 'border-ink/30 bg-transparent',
        )}
      >
        {active ? <Check className="h-2.5 w-2.5" strokeWidth={3} /> : null}
      </span>
      <span className="min-w-0">
        <span className="flex flex-wrap items-center gap-1.5">
          <span className="text-[12.5px] font-medium leading-snug text-ink">{title}</span>
          {badge ? (
            <span className="rounded-full bg-forest px-1.5 py-0.5 text-[9px] font-medium uppercase leading-none tracking-[0.08em] text-paper">
              {badge}
            </span>
          ) : null}
        </span>
        <span className="mt-1 block text-[11px] leading-snug text-muted">{detail}</span>
      </span>
    </label>
  )
}

/** One-time vs. subscribe & save, with a cadence select when subscribing. */
export function SubscribePicker({
  purchaseType,
  onPurchaseTypeChange,
  cadence,
  onCadenceChange,
  listPrice,
  className,
}: SubscribePickerProps) {
  const percent = Math.round(SUBSCRIPTION_DISCOUNT * 100)
  const subscriptionPrice = roundCurrency(listPrice * (1 - SUBSCRIPTION_DISCOUNT))
  const saving = Math.max(0, listPrice - subscriptionPrice)
  const subscribing = purchaseType === 'subscribe'
  const activeCadence = SUBSCRIPTION_CADENCES.find((option) => option.id === cadence)

  return (
    <fieldset className={cn('min-w-0', className)}>
      <legend className="flex w-full items-baseline justify-between gap-3 text-[11px] font-medium uppercase tracking-[0.16em] text-muted">
        <span>Purchase type</span>
        <span className="normal-case tracking-normal text-muted/80">
          {subscribing ? `${percent}% off every delivery` : 'Buy once'}
        </span>
      </legend>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <TypeCard
          name="purchase-type"
          value="one-time"
          active={!subscribing}
          title="One-time"
          detail={`${formatMoney(listPrice)} · ships once`}
          onSelect={onPurchaseTypeChange}
        />
        <TypeCard
          name="purchase-type"
          value="subscribe"
          active={subscribing}
          title="Subscribe & save"
          detail={`${formatMoney(subscriptionPrice)} per delivery`}
          badge={`−${percent}%`}
          onSelect={onPurchaseTypeChange}
        />
      </div>

      <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted">
        {subscribing
          ? `Saving ${formatMoney(saving)} per bag. Pause, skip or cancel anytime.`
          : `Subscribe and save ${formatMoney(saving)} per bag on every delivery.`}
      </p>

      {subscribing ? (
        <div className="mt-3 rounded-[2px] border border-ink/10 bg-surface px-4 py-3.5">
          <label htmlFor="subscription-cadence" className="field-label">
            Delivery frequency
          </label>
          <select
            id="subscription-cadence"
            value={cadence}
            onChange={(event) => onCadenceChange(event.target.value)}
            className="field h-11 cursor-pointer appearance-none bg-[length:14px] bg-[right_0.9rem_center] bg-no-repeat pr-10"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%2370685D' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")",
            }}
          >
            {SUBSCRIPTION_CADENCES.map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <p className="mt-2.5 flex items-start gap-1.5 text-[11px] leading-relaxed text-muted">
            <CalendarDays className="mt-px h-3.5 w-3.5 shrink-0 text-accent" strokeWidth={1.75} aria-hidden="true" />
            <span>
              {activeCadence ? activeCadence.label : 'On your schedule'} — roasted the week it ships.
              First delivery goes out with the next Tuesday roast.
            </span>
          </p>
        </div>
      ) : null}
    </fieldset>
  )
}
