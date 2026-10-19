import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Instagram, Mail } from 'lucide-react'
import { Logo } from './Logo'
import { Accordion } from '@/components/ui'
import { FOOTER_COLUMNS, SITE } from '@/lib/site'
import { useToast } from '@/store/ui'

const PAYMENT_METHODS = ['Visa', 'Mastercard', 'Amex', 'Apple Pay', 'PayPal', 'Shop Pay']

const FAQS = [
  {
    id: 'shipping',
    title: 'When does my coffee ship?',
    content:
      'We roast on Tuesdays and ship the same week. U.S. orders arrive in 2–4 business days; orders over $60 ship free. You will get tracking the moment your box leaves the roastery.',
  },
  {
    id: 'freshness',
    title: 'How fresh is the coffee?',
    content:
      'Every bag is roasted to order — never from a warehouse shelf. We recommend resting beans for 5–7 days after the roast date, then drinking within six weeks.',
  },
  {
    id: 'subscriptions',
    title: 'How do subscriptions work?',
    content:
      'Choose a coffee, size and cadence, and save 15% on every delivery. Skip, pause, change or cancel any time from the link in your confirmation email — no phone calls, no hoops.',
  },
  {
    id: 'returns',
    title: 'What if I don’t love it?',
    content:
      'Our 30-day happiness guarantee covers coffee and gear. Tell us what went wrong and we will replace it or refund you — whichever is more useful.',
  },
  {
    id: 'grind',
    title: 'Whole bean or ground?',
    content:
      'Whole bean stays fresher longer, but we will grind to order for pour-over, espresso, French press or moka pot at no extra cost. Choose your grind on any coffee page.',
  },
  {
    id: 'wholesale',
    title: 'Do you work with cafés?',
    content:
      'Yes — wholesale and office subscriptions are available. Email hello@emberandoak.coffee and we will send the current offering sheet and trade pricing.',
  },
]

export function Footer() {
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const pushToast = useToast()

  const onSubscribe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!email.trim()) return
    setSubscribed(true)
    setEmail('')
    pushToast({
      title: 'You’re on the list',
      description: 'A welcome note and a brewing guide are on their way.',
      tone: 'success',
    })
  }

  return (
    <footer className="mt-24">
      {/* Newsletter */}
      <section className="relative overflow-hidden bg-ink text-paper" aria-labelledby="newsletter-heading">
        <img
          src="/img/newsletter.webp"
          alt=""
          loading="lazy"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-[0.22]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/90 to-ink/40" />
        <div className="container-shell relative grid gap-10 py-16 md:grid-cols-[1.1fr_1fr] md:items-end md:gap-16 md:py-24">
          <div>
            <p className="eyebrow text-paper/50">The Sunday Letter</p>
            <h2 id="newsletter-heading" className="display-2 mt-4 max-w-lg text-paper">
              A slower morning, delivered once a month.
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/60">
              New lots, brewing notes and the occasional recipe. No noise, no daily emails — just
              the good stuff from the roastery.
            </p>
          </div>
          <div>
            {subscribed ? (
              <div className="flex items-start gap-3 border-t border-paper/20 pt-6">
                <span className="mt-1 flex h-7 w-7 items-center justify-center rounded-full bg-accent text-paper">
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </span>
                <div>
                  <p className="font-display text-2xl text-paper">You’re in.</p>
                  <p className="mt-1 text-sm text-paper/60">
                    Check your inbox for a welcome note — and enjoy 10% off with{' '}
                    <span className="text-paper">WELCOME10</span>.
                  </p>
                </div>
              </div>
            ) : (
              <form onSubmit={onSubscribe} className="w-full">
                <label htmlFor="newsletter-email" className="eyebrow text-paper/50">
                  Email address
                </label>
                <div className="mt-3 flex items-center gap-2 border-b border-paper/30 pb-2 focus-within:border-paper/70">
                  <input
                    id="newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    className="h-11 w-full bg-transparent text-[15px] text-paper placeholder:text-paper/35 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-paper text-ink transition-colors duration-300 hover:bg-accent hover:text-paper"
                    aria-label="Subscribe to the newsletter"
                  >
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
                <p className="mt-3 text-[11px] leading-relaxed text-paper/40">
                  By subscribing you agree to our privacy policy. Unsubscribe any time.
                </p>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* Support / FAQ */}
      <section id="support" className="border-b border-ink/10" aria-labelledby="support-heading">
        <div className="container-shell grid gap-10 py-16 md:grid-cols-[0.85fr_1.15fr] md:gap-20 lg:py-24">
          <div>
            <p className="eyebrow">Support</p>
            <h2 id="support-heading" className="display-3 mt-4">
              Good to know.
            </h2>
            <p className="mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
              Real humans answer these emails — usually within a few hours, always with an opinion
              about water temperature.
            </p>
            <a
              href={`mailto:${SITE.supportEmail}`}
              className="mt-7 inline-flex items-center gap-2 border-b border-ink/30 pb-1 text-[13px] font-medium text-ink transition-colors hover:border-accent hover:text-accent"
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              {SITE.supportEmail}
            </a>
            <dl className="mt-8 space-y-4 border-t border-ink/10 pt-6 text-[13px]">
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Roastery hours</dt>
                <dd className="text-ink">Tue – Sat, 8am – 3pm</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Order support</dt>
                <dd className="text-ink">Mon – Fri, 9am – 5pm PT</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">Shipping</dt>
                <dd className="text-ink">U.S. &amp; Canada</dd>
              </div>
            </dl>
          </div>
          <Accordion items={FAQS} defaultOpen={['shipping']} />
        </div>
      </section>

      {/* Links */}
      <div className="border-b border-ink/10">
        <div className="container-shell grid gap-12 py-14 md:grid-cols-[1.2fr_2fr] lg:py-20">
          <div>
            <Logo />
            <p className="mt-5 max-w-xs text-[13.5px] leading-relaxed text-muted">
              Small-batch coffee, roasted in Portland, Oregon. Sourced with care, brewed a little
              slower.
            </p>
            <address className="mt-6 space-y-1 text-[13px] not-italic leading-relaxed text-muted">
              <p>{SITE.address}</p>
              <p>
                <a href={`mailto:${SITE.supportEmail}`} className="link-underline text-ink">
                  {SITE.supportEmail}
                </a>
              </p>
              <p>{SITE.phone}</p>
            </address>
            <a
              href={SITE.instagram}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-[12px] font-medium uppercase tracking-[0.14em] text-ink transition-colors hover:text-accent"
            >
              <Instagram className="h-4 w-4" aria-hidden="true" /> Follow along
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.18em] text-ink">
                  {column.title}
                </h3>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        to={link.to}
                        className="text-[13px] text-muted transition-colors duration-200 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-shell flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        <p className="text-[11px] tracking-[0.02em] text-muted">
          © {new Date().getFullYear()} Ember &amp; Oak Coffee Roasters. All rights reserved.
        </p>
        <div className="flex flex-wrap items-center gap-1.5" aria-label="Accepted payment methods">
          {PAYMENT_METHODS.map((method) => (
            <span
              key={method}
              className="rounded-[3px] border border-ink/15 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.1em] text-muted"
            >
              {method}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[11px] text-muted">
          <span>United States · USD $</span>
          <span className="hidden h-3 w-px bg-ink/15 sm:block" />
          <Link to="/#support" className="transition-colors hover:text-ink">
            Privacy
          </Link>
          <Link to="/#support" className="transition-colors hover:text-ink">
            Terms
          </Link>
        </div>
      </div>
    </footer>
  )
}
