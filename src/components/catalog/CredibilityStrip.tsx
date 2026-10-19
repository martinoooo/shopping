const MESSAGES = [
  'Roasted to order every Tuesday',
  'Free U.S. shipping over $60',
  '14 partner farms · 6 countries',
  'Direct trade, long-term relationships',
  'Carbon-neutral delivery',
  'Brew guide with every bag',
]

export function CredibilityStrip() {
  return (
    <section
      aria-label="Why shop with Ember & Oak"
      className="relative w-full max-w-full overflow-hidden border-y border-ink/10 bg-surface"
    >
      <div className="w-full max-w-full overflow-hidden">
        <div className="flex w-max animate-marquee items-center py-3.5 hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[0, 1].map((pass) => (
            <ul
              key={pass}
              className="flex items-center"
              aria-hidden={pass === 1 ? true : undefined}
            >
              {MESSAGES.map((message) => (
                <li
                  key={message}
                  className="flex items-center whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.2em] text-muted"
                >
                  <span className="px-6">{message}</span>
                  <span className="h-1 w-1 rounded-full bg-accent/50" aria-hidden="true" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  )
}
