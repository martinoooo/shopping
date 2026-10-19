import type { ShippingDetails } from '@/lib/types'

export interface ShippingFormValues {
  firstName: string
  lastName: string
  email: string
  address: string
  apartment: string
  city: string
  region: string
  postalCode: string
  phone: string
}

export interface PaymentFormValues {
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

export type ShippingField = keyof ShippingFormValues
export type PaymentField = keyof PaymentFormValues
export type ShippingErrors = Partial<Record<ShippingField, string>>
export type PaymentErrors = Partial<Record<PaymentField, string>>

export const SHIPPING_FIELD_IDS: Record<ShippingField, string> = {
  firstName: 'shipping-first-name',
  lastName: 'shipping-last-name',
  email: 'shipping-email',
  address: 'shipping-address',
  apartment: 'shipping-apartment',
  city: 'shipping-city',
  region: 'shipping-region',
  postalCode: 'shipping-postal-code',
  phone: 'shipping-phone',
}

export const PAYMENT_FIELD_IDS: Record<PaymentField, string> = {
  cardName: 'payment-card-name',
  cardNumber: 'payment-card-number',
  expiry: 'payment-expiry',
  cvc: 'payment-cvc',
}

export const EMPTY_SHIPPING: ShippingFormValues = {
  firstName: '',
  lastName: '',
  email: '',
  address: '',
  apartment: '',
  city: '',
  region: '',
  postalCode: '',
  phone: '',
}

export const EMPTY_PAYMENT: PaymentFormValues = {
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvc: '',
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const ZIP_PATTERN = /^\d{5}(-\d{4})?$/

export function validateShipping(values: ShippingFormValues): ShippingErrors {
  const errors: ShippingErrors = {}
  if (!values.firstName.trim()) errors.firstName = 'Enter your first name.'
  if (!values.lastName.trim()) errors.lastName = 'Enter your last name.'

  const email = values.email.trim()
  if (!email) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(email)) errors.email = 'Enter a valid email address.'

  if (!values.address.trim()) errors.address = 'Enter your street address.'
  if (!values.city.trim()) errors.city = 'Enter your city.'
  if (!values.region) errors.region = 'Select your state.'

  const postalCode = values.postalCode.trim()
  if (!postalCode) errors.postalCode = 'Enter your ZIP code.'
  else if (!ZIP_PATTERN.test(postalCode)) errors.postalCode = 'Enter a valid US ZIP code (e.g. 97214).'

  const phoneDigits = values.phone.replace(/\D/g, '')
  if (phoneDigits && phoneDigits.length < 10) errors.phone = 'Enter a valid phone number.'

  return errors
}

function passesLuhn(digits: string): boolean {
  let sum = 0
  let double = false
  for (let index = digits.length - 1; index >= 0; index -= 1) {
    let digit = Number(digits[index])
    if (double) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
    double = !double
  }
  return sum % 10 === 0
}

function isFutureExpiry(value: string): boolean {
  const match = /^(\d{2})\s*\/\s*(\d{2})$/.exec(value.trim())
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  if (month < 1 || month > 12) return false
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth() + 1
  return year > currentYear || (year === currentYear && month >= currentMonth)
}

export function validatePayment(values: PaymentFormValues): PaymentErrors {
  const errors: PaymentErrors = {}
  if (!values.cardName.trim()) errors.cardName = 'Enter the name on your card.'

  const digits = values.cardNumber.replace(/\D/g, '')
  if (!digits) errors.cardNumber = 'Enter your card number.'
  else if (digits.length < 15 || digits.length > 16 || !passesLuhn(digits)) {
    errors.cardNumber = 'Enter a valid test card number.'
  }

  if (!values.expiry.trim()) errors.expiry = 'Enter the expiry date.'
  else if (!isFutureExpiry(values.expiry)) errors.expiry = 'Use MM/YY with a future date.'

  if (!/^\d{3,4}$/.test(values.cvc)) errors.cvc = 'Enter the 3 or 4 digit security code.'

  return errors
}

export function formatCardNumber(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, '').slice(0, 4)
  if (digits.length <= 2) return digits
  return `${digits.slice(0, 2)}/${digits.slice(2)}`
}

export function formatCvc(value: string): string {
  return value.replace(/\D/g, '').slice(0, 4)
}

/** Builds a plausible expiry that is always in the future, for live demos. */
function demoExpiry(): string {
  const date = new Date()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = String((date.getFullYear() + 3) % 100).padStart(2, '0')
  return `${month}/${year}`
}

export function demoShipping(): ShippingFormValues {
  return {
    firstName: 'Jordan',
    lastName: 'Ellison',
    email: 'jordan.ellison@example.com',
    address: '412 SE Ash Street',
    apartment: 'Apt 2',
    city: 'Portland',
    region: 'OR',
    postalCode: '97214',
    phone: '(503) 555-0184',
  }
}

export function demoPayment(): PaymentFormValues {
  return {
    cardName: 'Jordan Ellison',
    cardNumber: '4242 4242 4242 4242',
    expiry: demoExpiry(),
    cvc: '424',
  }
}

export function toShippingDetails(values: ShippingFormValues): ShippingDetails {
  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    email: values.email.trim(),
    address: values.address.trim(),
    apartment: values.apartment.trim() || undefined,
    city: values.city.trim(),
    region: values.region,
    postalCode: values.postalCode.trim(),
    country: 'United States',
    phone: values.phone.trim() || undefined,
  }
}
