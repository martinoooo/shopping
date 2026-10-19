import { Truck } from 'lucide-react'
import { FREE_SHIPPING_THRESHOLD } from '@/store/cart'
import { formatMoney } from '@/lib/utils'
import { SelectField, TextField } from './FormField'
import { US_STATES } from './usStates'
import { SHIPPING_FIELD_IDS } from './validation'
import type { ShippingErrors, ShippingField, ShippingFormValues } from './validation'

interface ShippingStepProps {
  values: ShippingFormValues
  errors: ShippingErrors
  onChange: (field: ShippingField, value: string) => void
  onBlur: (field: ShippingField) => void
}

export function ShippingStep({ values, errors, onChange, onBlur }: ShippingStepProps) {
  const fieldProps = (field: ShippingField) => ({
    id: SHIPPING_FIELD_IDS[field],
    error: errors[field],
    onBlur: () => onBlur(field),
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...fieldProps('firstName')}
          label="First name"
          value={values.firstName}
          onChange={(event) => onChange('firstName', event.target.value)}
          autoComplete="given-name"
          autoCapitalize="words"
          required
        />
        <TextField
          {...fieldProps('lastName')}
          label="Last name"
          value={values.lastName}
          onChange={(event) => onChange('lastName', event.target.value)}
          autoComplete="family-name"
          autoCapitalize="words"
          required
        />
      </div>

      <TextField
        {...fieldProps('email')}
        label="Email"
        type="email"
        value={values.email}
        onChange={(event) => onChange('email', event.target.value)}
        autoComplete="email"
        inputMode="email"
        autoCapitalize="none"
        spellCheck={false}
        hint="For order updates only — no marketing unless you ask."
        required
      />

      <TextField
        {...fieldProps('address')}
        label="Street address"
        value={values.address}
        onChange={(event) => onChange('address', event.target.value)}
        autoComplete="address-line1"
        required
      />
      <TextField
        {...fieldProps('apartment')}
        label="Apartment, suite, etc."
        value={values.apartment}
        onChange={(event) => onChange('apartment', event.target.value)}
        autoComplete="address-line2"
        optional
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...fieldProps('city')}
          label="City"
          value={values.city}
          onChange={(event) => onChange('city', event.target.value)}
          autoComplete="address-level2"
          autoCapitalize="words"
          required
        />
        <SelectField
          {...fieldProps('region')}
          label="State"
          value={values.region}
          onChange={(event) => onChange('region', event.target.value)}
          options={US_STATES}
          placeholder="Select a state"
          autoComplete="address-level1"
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          {...fieldProps('postalCode')}
          label="ZIP code"
          value={values.postalCode}
          onChange={(event) => onChange('postalCode', event.target.value)}
          autoComplete="postal-code"
          inputMode="numeric"
          maxLength={10}
          required
        />
        <TextField
          {...fieldProps('phone')}
          label="Phone"
          type="tel"
          value={values.phone}
          onChange={(event) => onChange('phone', event.target.value)}
          autoComplete="tel"
          inputMode="tel"
          optional
        />
      </div>

      <div>
        <p className="field-label">Country</p>
        <div className="flex h-12 items-center justify-between border border-ink/10 bg-cream/40 px-4 text-[15px] text-ink">
          <span>United States</span>
          <span className="text-[10px] uppercase tracking-[0.14em] text-muted">Standard delivery</span>
        </div>
      </div>

      <div className="mt-6 flex items-start gap-3 border border-ink/10 bg-cream/30 px-4 py-4">
        <Truck className="mt-0.5 h-4 w-4 shrink-0 text-forest" strokeWidth={1.75} aria-hidden="true" />
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink">Standard delivery</p>
          <p className="mt-0.5 text-[12px] leading-relaxed text-muted">
            Roasted to order, arrives in 3–5 business days. Free over{' '}
            {formatMoney(FREE_SHIPPING_THRESHOLD)}; {formatMoney(7.95)} otherwise.
          </p>
        </div>
      </div>
    </div>
  )
}
