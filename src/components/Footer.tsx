import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-600">
            © {new Date().getFullYear()} PriceCart. Built for Canadians.
          </div>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-slate-700">
            <Link href="/pricing" className="hover:text-slate-900">Pricing</Link>
            <Link href="/faq" className="hover:text-slate-900">FAQ</Link>
            <Link href="/legal/privacy" className="hover:text-slate-900">Privacy</Link>
            <Link href="/legal/terms" className="hover:text-slate-900">Terms</Link>
          </div>
        </div>
        <p className="mt-6 text-xs text-slate-500">
          Prices can change by location and availability. We aim to refresh data daily.
          We don’t sell rankings and we don’t sell your shopping list data.
        </p>
      </div>
    </footer>
  );
}