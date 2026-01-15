import { Button } from "@/components/Button";

export default function PricingPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Pricing</h1>
        <p className="mt-3 text-slate-700">Try Pro free for 14 days. No credit card required. Cancel anytime.</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          <Plan title="PriceCart Basic" price="Free" sub="A quick taste of the value"
            bullets={[
              "Compare up to 5 items/week",
              "See prices at all 4 stores",
              "Basic comparison (no history)",
            ]}
            cta={<Button href="/auth/signup" variant="ghost" className="w-full border border-slate-200">Try Basic</Button>}
          />

          <Plan featured title="PriceCart Pro" price="$6.99/month" sub="Or $59.99/year (save $24)"
            bullets={[
              "Unlimited comparisons",
              "Saved shopping lists",
              "Multi-store cart optimizer",
              "Price history & charts",
              "Price drop alerts",
              "Weekly savings report",
            ]}
            cta={<Button href="/auth/signup" variant="primary" className="w-full">Start free (14 days)</Button>}
            note="No credit card. Cancel anytime. No sponsored rankings."
          />

          <Plan title="Family" price="$79.99/year" sub="For households with 2+ shoppers"
            bullets={[
              "Everything in Pro",
              "Share lists with family",
              "Shared savings report",
            ]}
            cta={<Button href="/auth/signup" variant="secondary" className="w-full">Start free (14 days)</Button>}
          />
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <h2 className="text-xl font-extrabold text-slate-900">The guarantee</h2>
          <p className="mt-2 text-slate-600">No tricks. No sponsored rankings. If you’re not saving money, cancel.</p>
          <div className="mt-5 flex gap-2">
            <Button href="/auth/signup" variant="primary">Start free</Button>
            <Button href="/faq" variant="ghost" className="border border-slate-200">Read FAQ</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Plan({
  title, price, sub, bullets, cta, note, featured
}: {
  title: string; price: string; sub: string; bullets: string[];
  cta: React.ReactNode; note?: string; featured?: boolean;
}) {
  return (
    <div className={`rounded-2xl bg-white p-6 shadow-[0_12px_30px_rgba(2,6,23,0.10)] border ${
      featured ? "border-[color:var(--pc-green)]/35" : "border-slate-200"
    }`}>
      <div className="flex items-center justify-between gap-3">
        <div className="text-sm font-bold text-slate-700">{title}</div>
        {featured && (
          <span className="rounded-full bg-[color:var(--pc-green)]/15 px-3 py-1 text-xs font-bold text-slate-900">
            Most popular
          </span>
        )}
      </div>
      <div className="mt-2 text-3xl font-extrabold text-slate-900">{price}</div>
      <div className="mt-1 text-sm text-slate-600">{sub}</div>
      <ul className="mt-4 space-y-2 text-sm text-slate-700">
        {bullets.map((b) => <li key={b}>✅ {b}</li>)}
      </ul>
      <div className="mt-5">{cta}</div>
      {note && <div className="mt-3 text-xs text-slate-600">{note}</div>}
    </div>
  );
}