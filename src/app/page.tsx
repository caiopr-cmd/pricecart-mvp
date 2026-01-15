import { Button } from "@/components/Button";

const rows = [
  { item: "Chicken breast", best: "Maxi", bestPrice: "$13.99/kg", next: "Metro", nextPrice: "$16.50/kg", save: "$2.51/kg" },
  { item: "Eggs (12)", best: "Super C", bestPrice: "$4.49", next: "Metro", nextPrice: "$5.29", save: "$0.80" },
  { item: "Greek yogurt", best: "Metro", bestPrice: "$3.99", next: "Provigo", nextPrice: "$4.49", save: "$0.50" },
];

export default function HomePage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-14 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
              Compare grocery prices across Montreal. Save money every week.
            </h1>
            <p className="mt-4 text-base text-slate-700 sm:text-lg">
              We check prices at <span className="font-semibold">Maxi, Metro, Provigo, and Super C</span>—so you know where to shop in seconds.
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button href="/auth/signup" variant="primary" className="px-6 py-3">
                Start free (14 days)
              </Button>
              <Button href="/compare" variant="ghost" className="px-6 py-3 border border-slate-200">
                See how it works
              </Button>
            </div>

            <div className="mt-4 text-sm text-slate-600">
              No credit card. Cancel anytime. No sponsored rankings.
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              <Stat label="Typical monthly savings" value="$50–$100" />
              <Stat label="Stores compared" value="4" />
              <Stat label="Time to check a list" value="~30 sec" />
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
            <div className="flex items-center justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <div className="text-sm font-bold text-slate-900">Example (this is what you see)</div>
                <div className="text-xs text-slate-600">Clean UI. Clear savings.</div>
              </div>
              <span className="rounded-full bg-[color:var(--pc-orange)]/15 px-3 py-1 text-xs font-bold text-slate-900">
                Updated daily
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-bold text-slate-700">
                  <tr>
                    <th className="px-5 py-3">Item</th>
                    <th className="px-5 py-3">Best store</th>
                    <th className="px-5 py-3">Best price</th>
                    <th className="px-5 py-3">Next best</th>
                    <th className="px-5 py-3">Save</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.item} className="border-t border-slate-200">
                      <td className="px-5 py-4 font-semibold text-slate-900">{r.item}</td>
                      <td className="px-5 py-4">
                        <span className="rounded-lg bg-[color:var(--pc-green)]/15 px-2 py-1 text-xs font-bold text-slate-900">
                          {r.best}
                        </span>
                      </td>
                      <td className="px-5 py-4 font-semibold tabular-nums">{r.bestPrice}</td>
                      <td className="px-5 py-4 text-slate-700 tabular-nums">
                        {r.next} <span className="text-slate-500">({r.nextPrice})</span>
                      </td>
                      <td className="px-5 py-4 font-bold text-slate-900 tabular-nums">{r.save}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="px-5 py-4 text-xs text-slate-600">
              Tip: unit price (like <span className="font-semibold">$ / kg</span>) makes comparisons fair, even when package sizes change.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6">
          <h2 className="text-2xl font-extrabold text-slate-900">Straightforward tools that actually help</h2>
          <p className="mt-2 text-slate-600">We show the data. You make the call.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card title="Compare 4 major stores" desc="Maxi, Metro, Provigo, and Super C—side by side." />
          <Card title="Cart optimization" desc="Best store mix for your full list. You decide what’s worth the trip." />
          <Card title="Unit pricing that matters" desc="See $/kg, $/L, and $/100g so you’re not fooled by package size." />
          <Card title="Price history & alerts (Pro)" desc="Know if something is truly on sale, and get notified when prices drop." />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="rounded-3xl bg-cinematic-dark px-6 py-10 text-white shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h3 className="text-2xl font-extrabold">The PriceCart guarantee</h3>
              <p className="mt-2 text-white/80">If you don’t save money, we don’t deserve your money.</p>
              <ul className="mt-5 space-y-2 text-sm text-white/90">
                <li>✅ 14 days free, no credit card</li>
                <li>✅ Cancel anytime</li>
                <li>✅ No sponsored rankings</li>
                <li>✅ Real prices, refreshed regularly</li>
                <li>✅ Privacy-first (we don’t sell your lists)</li>
              </ul>
              <div className="mt-6">
                <Button href="/auth/signup" variant="primary" className="px-6 py-3">Start free</Button>
              </div>
            </div>

            <div className="rounded-2xl bg-white/10 p-6">
              <div className="text-sm font-bold text-white/90">What Pro looks like</div>
              <p className="mt-2 text-sm text-white/80">
                “You could save <span className="font-bold text-white">$12</span> by buying meat at Maxi and dairy at Metro this week.”
              </p>
              <div className="mt-4 rounded-xl bg-white/10 p-4 text-sm">
                <Row label="This week" value="$47 saved" />
                <Row label="This month" value="$183 saved" />
                <Row label="Your subscription" value="$6.99" />
              </div>
              <p className="mt-3 text-xs text-white/70">Example numbers for MVP. Your real savings will be based on your own list.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="text-xl font-extrabold text-slate-900">Ready to shop smarter?</div>
              <div className="mt-1 text-sm text-slate-600">Build your list and see savings in minutes.</div>
            </div>
            <div className="flex gap-2">
              <Button href="/auth/signup" variant="primary" className="px-6 py-3">Start free</Button>
              <Button href="/pricing" variant="ghost" className="px-6 py-3 border border-slate-200">View pricing</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
      <div className="text-xs font-bold text-slate-600">{label}</div>
      <div className="mt-1 text-xl font-extrabold text-slate-900 tabular-nums">{value}</div>
    </div>
  );
}

function Card({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
      <div className="flex items-start justify-between gap-3">
        <div className="text-base font-extrabold text-slate-900">{title}</div>
        <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--pc-green)] floaty" />
      </div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/80">{label}</span>
      <span className="font-extrabold tabular-nums">{value}</span>
    </div>
  );
}