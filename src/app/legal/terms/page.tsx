export default function TermsPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Terms of Service (MVP)</h1>
        <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <Block title="Pricing accuracy">
            Prices can change by location and availability. PriceCart aims to refresh data regularly, but can’t guarantee checkout totals.
          </Block>
          <Block title="No sponsored rankings">
            Comparisons are based on observed prices. Stores don’t pay to rank higher.
          </Block>
          <Block title="Contact">
            Add your support email here (e.g., support@pricecart.ca).
          </Block>
          <p className="text-xs text-slate-500">Placeholder MVP copy — replace with final terms before launch.</p>
        </div>
      </section>
    </main>
  );
}

function Block({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{children}</p>
    </div>
  );
}
