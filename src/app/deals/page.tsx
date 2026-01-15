import { Button } from "@/components/Button";

const deals = [
  { item: "Chicken breast", store: "Maxi", price: "$13.99/kg", note: "Best unit price today" },
  { item: "Bananas", store: "Super C", price: "$1.29/lb", note: "Solid staple deal" },
  { item: "Milk (2L)", store: "Metro", price: "$5.29", note: "Check brand + size" },
];

export default function DealsPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Deals</h1>
        <p className="mt-3 text-slate-700">
          A public taste of what PriceCart tracks. Pro users get alerts, history, and full cart optimization.
        </p>

        <div className="mt-8 grid gap-4">
          {deals.map((d) => (
            <div key={d.item} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-base font-extrabold text-slate-900">{d.item}</div>
                  <div className="mt-1 text-sm text-slate-600">{d.note}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-slate-700">{d.store}</div>
                  <div className="text-xl font-extrabold text-slate-900 tabular-nums">{d.price}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <h2 className="text-xl font-extrabold text-slate-900">Want alerts when prices drop?</h2>
          <p className="mt-2 text-slate-600">Pro users can track favourites and get notified when something hits a great price.</p>
          <div className="mt-5">
            <Button href="/auth/signup" variant="primary">Start free (14 days)</Button>
          </div>
        </div>
      </section>
    </main>
  );
}
