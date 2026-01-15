import { Button } from "@/components/Button";

export default function HowItWorksPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">How it works</h1>
        <p className="mt-3 text-slate-700">
          Straightforward: you bring the list, we bring the prices. You decide where to shop.
        </p>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          <Step n="1" title="Add your items" desc="Search products or build a list in seconds." />
          <Step n="2" title="Compare 4 stores" desc="See current prices across Maxi, Metro, Provigo, and Super C." />
          <Step n="3" title="Save with confidence" desc="Pick the best store per item—or optimize your full cart." />
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <h2 className="text-xl font-extrabold text-slate-900">Why unit price matters</h2>
          <p className="mt-2 text-slate-600">
            A 500g pack at $7.50 is $15/kg. A 1kg pack at $14.00 is cheaper—even if the sticker price looks higher.
          </p>
          <div className="mt-5">
            <Button href="/auth/signup" variant="primary">Start free (14 days)</Button>
          </div>
        </div>
      </section>
    </main>
  );
}

function Step({ n, title, desc }: { n: string; title: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
      <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[color:var(--pc-green)]/15 text-sm font-extrabold text-slate-900">
        {n}
      </div>
      <div className="mt-4 text-base font-extrabold text-slate-900">{title}</div>
      <p className="mt-2 text-sm text-slate-600">{desc}</p>
    </div>
  );
}