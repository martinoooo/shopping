export const SITE = {
  name: 'Ember & Oak',
  shortName: 'E&O',
  tagline: 'Slow-roasted coffee, brewed well.',
  description:
    'Small-batch coffee roasted in Portland, Oregon. Single-origin beans, considered brewing gear, and everything you need for a slower morning.',
  freeShippingThreshold: 60,
  supportEmail: 'hello@emberandoak.coffee',
  phone: '+1 (503) 555-0184',
  address: '412 SE Ash Street, Portland, OR 97214',
  instagram: 'https://instagram.com',
  currency: 'USD',
  country: 'United States',
} as const

export const NAV_LINKS = [
  { label: 'Shop all', to: '/shop' },
  { label: 'Coffee', to: '/shop?category=coffee' },
  { label: 'Brew gear', to: '/shop?category=gear' },
  { label: 'Cups & more', to: '/shop?category=accessories' },
  { label: 'Our story', to: '/#story' },
] as const

export const ANNOUNCEMENTS = [
  'Free U.S. shipping over $60',
  'Roasted to order every Tuesday',
  'New: Costa Rica Tarrazú',
  'Subscribe & save 15%',
] as const

export const FOOTER_COLUMNS = [
  {
    title: 'Shop',
    links: [
      { label: 'All coffee', to: '/shop?category=coffee' },
      { label: 'Brew gear', to: '/shop?category=gear' },
      { label: 'Cups & accessories', to: '/shop?category=accessories' },
      { label: 'Best sellers', to: '/shop?sort=rating' },
      { label: 'Subscriptions', to: '/product/ethiopia-guji' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Our story', to: '/#story' },
      { label: 'Sourcing', to: '/#sourcing' },
      { label: 'Brew guides', to: '/#brew-guides' },
      { label: 'Support', to: '/#support' },
      { label: 'Contact us', to: '/#support' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Shipping & returns', to: '/#support' },
      { label: 'FAQ', to: '/#support' },
      { label: 'Track your order', to: '/#support' },
      { label: 'Contact us', to: '/#support' },
      { label: 'Privacy & terms', to: '/#support' },
    ],
  },
] as const

export const TRUST_POINTS = [
  {
    title: 'Roasted to order',
    description: 'Every batch is roasted the week it ships. Never sitting on a shelf.',
  },
  {
    title: 'Direct trade',
    description: 'Long-term relationships with 14 partner farms across 6 countries.',
  },
  {
    title: 'Free shipping over $60',
    description: 'Carbon-neutral delivery across the United States, in 2–4 days.',
  },
  {
    title: 'Brew it right',
    description: 'Free brewing guide with every bag, plus help from real humans.',
  },
] as const
