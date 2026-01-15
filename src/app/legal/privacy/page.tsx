export default function PrivacyPage() {
  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-4xl px-4 py-14">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">Privacy Policy (MVP)</h1>
        <div className="mt-8 space-y-6 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <Block title="What we collect">Account info (like email) and the lists you create in the app.</Block>
          <Block title="What we don’t do">We don’t sell your shopping lists or personal data. We don’t sell rankings.</Block>
          <Block title="Contact">Add your support email here (e.g., support@pricecart.ca).</Block>
          <p className="text-xs text-slate-500">Placeholder MVP copy — replace with your final policy before launch.</p>
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
