# Ember & Oak — Coffee Storefront

A demo-ready, mobile-first e-commerce storefront for a fictional Portland coffee roaster. Built with
React + TypeScript + Vite + Tailwind, deployable to Vercel with zero configuration.

> **Demo mode.** Product data, reviews, pricing and checkout are fully mocked in the client. There is
> no backend, no login and no real payment processing.

---

## Why this product

The brief asked for a consumer shopping experience that feels presentable to a client. Rather than a
generic catalogue, I built a coherent direct-to-consumer coffee brand with a real merchandising
model:

- **A considered range** — 19 SKUs across coffee, brew gear and accessories, with roast levels,
  origins, tasting notes, grind options and real product copy.
- **A reason to return** — subscribe & save (15% off, flexible cadence) is woven into the product page
  and cart, not bolted on.
- **The details that build trust** — roast dates, free-shipping threshold, delivery estimates, stock
  urgency, reviews with rating breakdowns, FAQ, returns policy.
- **A visual language** — warm paper tones, Fraunces display type, editorial photography and quiet
  motion, so the store feels premium rather than like a template.

The core journey is deliberately short: **browse → find → understand → add to cart → checkout**.

---

## Feature highlights

### Browse & discover
- Editorial home page: full-bleed hero, category tiles, bestsellers, new arrivals, "find your brew"
  by method, roastery story with sourcing stats, testimonials.
- Instant search dialog with keyboard support across product names, origins, notes and types.
- Shop page with URL-synced filters (category, roast, brew method, price, search, sort), active filter
  chips, desktop sidebar, mobile filter drawer, result counts and empty states.
- Wishlist persisted locally, with quick save from any product card.

### Evaluate
- Product detail page with gallery, zoom, option pickers (size, grind, colour/glaze), subscribe &
  save, stock urgency, delivery estimates, flavour profile, accordions, reviews and related products.
- Sticky add-to-cart bar on mobile; sticky purchase panel on desktop.

### Convert
- Cart drawer with free-shipping progress, quantity editing, subscription badges and product
  upsells.
- Three-step checkout (shipping → payment → review) with validation, promo codes, a collapsible
  order summary and an explicit demo-mode notice.
- Order confirmation with order number, estimated delivery, itemised totals and saved order state
  (survives refresh via localStorage).

### Craft
- Fully responsive from 360px phones to 1440px+ desktops; safe-area support.
- Accessible primitives: focus trapping in dialogs/drawers, escape-to-close, body scroll lock,
  labelled controls, visible focus rings, reduced-motion support.
- Local WebP photography (no runtime image CDN dependency), skeleton and fallback states.
- Toast system, empty states, 404 page and persistent cart/wishlist.

---

## Tech stack

| Layer | Choice | Notes |
| --- | --- | --- |
| UI | React 19 + TypeScript | strict mode, no `any` |
| Build | Vite 6 | fast dev, static build |
| Styling | Tailwind CSS 3.4 | design tokens as CSS variables |
| Routing | React Router 6 | SPA with Vercel rewrite |
| State | Zustand 5 + persist | cart, wishlist, toasts/search UI |
| Icons | lucide-react | tree-shaken |
| Type | Fraunces + Inter (self-hosted via Fontsource) | no external font requests |
| QA | Playwright (Edge) screenshot helper | `scripts/shot.mjs` |

No UI kit. The design system (`src/components/ui`) and the brand styling were built for this brief.

---

## Getting started

Requirements: Node 20+ and npm.

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run preview
```

Type check:

```bash
npm run typecheck
```

Visual QA (dev server must be running):

```bash
node scripts/shot.mjs / home --full
node scripts/shot.mjs /shop shop --mobile --full
node scripts/shot.mjs /product/ethiopia-guji pdp
```

Screenshots land in `.qa/` (gitignored) alongside any console errors.

---

## Deploy to Vercel

The repo is Vercel-ready. `vercel.json` sets the Vite framework preset, build command, output
directory and the SPA rewrite so deep links like `/product/ethiopia-guji` work on refresh.

**Option A — dashboard**

1. Push this folder to a Git repository.
2. In Vercel, **Add New → Project**, import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. Deploy. No environment variables are required.

**Option B — CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

---

## Project structure

```
src/
  components/
    ui/           # design primitives: Button, Drawer, Modal, Price, SmartImage, Toaster...
    layout/       # announcement bar, header, mobile nav, footer, FAQ, logo
    catalog/      # ProductCard, home sections, shop filters, search dialog
    product/      # gallery, purchase panel, reviews, related products
    cart/         # cart drawer, line items, free-shipping meter, upsells
    checkout/     # stepper, forms, order summary, demo helpers
  data/           # mock catalogue and reviews
  lib/            # types, formatters, hooks, site configuration
  pages/          # routed pages
  store/          # cart, wishlist, UI stores (Zustand + persist)
  index.css       # tokens, base styles, utilities
docs/             # demo script (zh)
scripts/          # QA screenshots + E2E
public/img/       # local WebP photography and category imagery
```

---

## Product decisions & trade-offs

**Prioritised for the demo**
1. A complete, believable purchase funnel over breadth of features.
2. Mobile excellence — the demo is most convincing on a phone.
3. A distinctive art direction, because a generic storefront is hard to remember.
4. The commerce details a client would ask about: subscriptions, promos, shipping thresholds,
   taxes, stock, delivery estimates, order confirmation.

**Deliberately out of scope**
- Backend, authentication, real payments, inventory sync, CMS, email, analytics.
- Full product comparison, multi-currency, i18n, dark mode.
- Account/order history beyond the persisted last order.

**Next steps if this went to production**
- Headless commerce backend (Shopify Storefront API or Medusa) behind the existing data layer.
- Stripe Checkout / Payment Element with server-side order creation and webhooks.
- Real search (Algolia/Typesense), analytics events, A/B testing hooks, image CDN variants.
- Automated accessibility (axe) and visual regression in CI; unit tests for cart pricing.

---

## Mock data & pricing rules

- 19 products across 3 categories in `src/data/products.ts`.
- Free shipping over **$60**, flat **$7.95** under the threshold, estimated tax **8%**.
- Subscribe & save is **15% off**, with 2/4/8-week cadence options.
- Promo codes: `WELCOME10` (10% off), `FREESHIP` (free shipping).
- Cart and wishlist persist in `localStorage`.

---

## Credits

Photography from [Shopify Burst](https://www.shopify.com/stock-photos) — free stock photos for
commercial use. Fonts: Fraunces and Inter via Fontsource (SIL Open Font License). All brand names,
product copy, pricing and reviews are fictional and created for this demo.
