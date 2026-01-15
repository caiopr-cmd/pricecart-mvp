import { Button } from "@/components/Button";

const faqs = [
  { q: "How often are prices updated?", a: "We aim to refresh data daily. Prices can change by location and availability, so unit pricing keeps comparisons fair." },
  { q: "Do stores pay to rank higher?", a: "No. We don’t sell rankings. Cheapest price wins—period." },
  { q: "Why do you show $/kg and $/L?", a: "Because package sizes vary. Unit price is the cleanest way to compare." },
  { q: "Is PriceCart only for Montreal?", a: "Yes for MVP. We’ll expand once coverage and accuracy are rock solid." },
];

export default function FAQPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">FAQ</h1>
        <p className="mt-3 text-slate-700">Quick answers. No jargon.</p>

        <div className="mt-8 max-w-3xl space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
              <summary className="cursor-pointer list-none font-extrabold text-slate-900">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-[color:var(--pc-green)] align-middle" />
                {f.q}
                <span className="float-right text-slate-500 group-open:rotate-180 transition">▾</span>
              </summary>
              <p className="mt-3 text-sm text-slate-600">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <h2 className="text-xl font-extrabold text-slate-900">Ready to try it?</h2>
          <p className="mt-2 text-slate-600">Build your list and see the cheapest stores in minutes.</p>
          <div className="mt-5 flex gap-2">
            <Button href="/auth/signup" variant="primary">Start free</Button>
            <Button href="/pricing" variant="ghost" className="border border-slate-200">See pricing</Button>
          </div>
        </div>
      </section>
    </main>
  );
}