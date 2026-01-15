"use client";

import { useMemo, useRef, useState } from "react";
import { Button } from "@/components/Button";

type StoreKey = "maxi" | "metro" | "provigo" | "superc";

type CompareItem = {
  query: string;
  parsed?: { qty?: number; unit?: string };
  match?: {
    productId: string;
    name: string;
    brand?: string;
    size?: string;
    confidence: number;
    needsReview?: boolean;
  };
  prices: Partial<Record<StoreKey, { price: number; unit: string; unitPrice: number; url?: string }>>;
  bestStore?: StoreKey;
  bestUnitPrice?: number;
  savingsVsNext?: number;
};

type CompareResponse = {
  lastUpdated: string;
  items: CompareItem[];
  cart: {
    perStoreTotals: Record<StoreKey, number>;
    bestSingleStore: { store: StoreKey; total: number };
    bestMixed: { total: number; storesUsed: StoreKey[]; plan: Record<StoreKey, string[]> };
    estimatedSavingsVsWorst: number;
  };
};

const STORE_LABEL: Record<StoreKey, string> = {
  maxi: "Maxi",
  metro: "Metro",
  provigo: "Provigo",
  superc: "Super C",
};

function cleanLine(s: string) {
  return (s || "").replace(/\s+/g, " ").trim();
}

function parseLines(text: string) {
  const lines = (text || "")
    .split(/\r?\n|,/g)
    .map((l) => cleanLine(l))
    .filter(Boolean);

  // Basic quantity parse: "2x eggs", "1 kg chicken"
  return lines.map((line) => {
    const m = line.match(/^\s*(\d+(?:\.\d+)?)\s*(x|×)?\s*(kg|g|lb|l|ml)?\s*(.+)$/i);
    if (m) {
      const qty = Number(m[1]);
      const unit = m[3]?.toLowerCase();
      const query = cleanLine(m[4]);
      return { query, parsed: { qty, unit } };
    }
    return { query: line as string };
  });
}

export default function ComparePage() {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [raw, setRaw] = useState<string>(
    "chicken breast\neggs (12)\ngreek yogurt\nbananas\nmilk 2L\nbread\nlettuce"
  );
  const [strategy, setStrategy] = useState<"min_total" | "min_stores">("min_total");
  const [maxStores, setMaxStores] = useState<1 | 2 | 3 | 4>(2);
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<CompareResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const items = useMemo(() => parseLines(raw), [raw]);

  async function runCompare() {
    setLoading(true);
    setError(null);
    setRes(null);
    try {
      const r = await fetch("/api/compare", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items, strategy, maxStores }),
      });
      if (!r.ok) throw new Error(`Request failed (${r.status})`);
      const data = (await r.json()) as CompareResponse;
      setRes(data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function onPickFile(file: File) {
    const text = await file.text();
    setRaw(text);
  }

  return (
    <main className="bg-cinematic">
      <section className="mx-auto max-w-6xl px-4 py-10 sm:py-14">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
              Drop your list. We’ll compare 4 stores.
            </h1>
            <p className="mt-2 text-slate-700">
              Paste your grocery list or upload a .txt file. We’ll match products and show the cheapest store per item.
            </p>
          </div>

          <div className="flex gap-2">
            <Button href="/pricing" variant="ghost" className="border border-slate-200 px-5 py-3">
              Pro features
            </Button>
            <Button href="/auth/signup" variant="primary" className="px-5 py-3">
              Start free
            </Button>
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-5">
          {/* INPUT */}
          <div className="lg:col-span-2 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-sm font-extrabold text-slate-900">Your list</div>
                <div className="mt-1 text-xs text-slate-600">
                  One item per line. (You can also paste comma-separated.)
                </div>
              </div>
              <button
                className="text-xs font-bold text-slate-700 hover:text-slate-900"
                onClick={() => setRaw("chicken breast\neggs (12)\ngreek yogurt\nbananas\nmilk 2L\nbread\nlettuce")}
              >
                Use example
              </button>
            </div>

            <textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              className="mt-4 h-56 w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-900 outline-none focus:ring-2 focus:ring-[color:var(--pc-blue)]"
              placeholder="e.g. chicken breast\neggs\nmilk\nbread"
            />

            <div className="mt-3 flex flex-wrap gap-2">
              {items.slice(0, 12).map((it, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700"
                  title={it.parsed?.qty ? `${it.parsed.qty}${it.parsed.unit ? " " + it.parsed.unit : ""}` : undefined}
                >
                  {it.query}
                </span>
              ))}
              {items.length > 12 && (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                  +{items.length - 12} more
                </span>
              )}
            </div>

            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-bold text-slate-700">Optimization</div>
                <div className="mt-2 flex flex-col gap-2">
                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-700">Goal</span>
                    <select
                      value={strategy}
                      onChange={(e) => setStrategy(e.target.value as any)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[color:var(--pc-blue)]"
                    >
                      <option value="min_total">Lowest total</option>
                      <option value="min_stores">Fewer stores</option>
                    </select>
                  </label>

                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span className="text-slate-700">Max stores</span>
                    <select
                      value={maxStores}
                      onChange={(e) => setMaxStores(Number(e.target.value) as any)}
                      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 outline-none focus:ring-2 focus:ring-[color:var(--pc-blue)]"
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                    </select>
                  </label>

                  <p className="text-xs text-slate-600">
                    You’ll see the cheapest store per item—and a suggested plan based on your goal.
                  </p>
                </div>
              </div>

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files?.[0];
                  if (f) onPickFile(f);
                }}
                className="rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-center"
              >
                <div className="text-sm font-extrabold text-slate-900">Upload a list</div>
                <div className="mt-1 text-xs text-slate-600">Drop a .txt file here, or pick one</div>
                <div className="mt-3 flex justify-center gap-2">
                  <button
                    className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50"
                    onClick={() => fileRef.current?.click()}
                  >
                    Choose file
                  </button>
                  <button
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-slate-800"
                    onClick={runCompare}
                    disabled={loading || items.length === 0}
                  >
                    {loading ? "Comparing..." : "Compare prices"}
                  </button>
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onPickFile(f);
                  }}
                />
              </div>

              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* RESULTS */}
          <div className="lg:col-span-3 rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className="text-sm font-extrabold text-slate-900">Comparison</div>
                <div className="mt-1 text-xs text-slate-600">
                  {res ? `Last updated: ${res.lastUpdated}` : "Run a comparison to see results."}
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-800 hover:bg-slate-50 disabled:opacity-50"
                  disabled={!res}
                  onClick={() => {
                    if (!res) return;
                    const csv = toCSV(res);
                    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = "pricecart-comparison.csv";
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                >
                  Export CSV
                </button>
                <Button href="/auth/signup" variant="primary" className="px-4 py-2 text-xs">
                  Save lists (Pro)
                </Button>
              </div>
            </div>

            {!res && (
              <div className="mt-6 rounded-2xl bg-slate-50 p-6">
                <div className="text-base font-extrabold text-slate-900">What you’ll get</div>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>✅ Cheapest store per item</li>
                  <li>✅ Estimated totals per store</li>
                  <li>✅ Suggested plan (based on your goal)</li>
                  <li>✅ Unit pricing ($/kg, $/L) where it matters</li>
                </ul>
                <p className="mt-4 text-xs text-slate-600">
                  For MVP, results may use mock data until your DB queries are wired.
                </p>
              </div>
            )}

            {res && (
              <>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  <Stat label="Best single store" value={`${STORE_LABEL[res.cart.bestSingleStore.store]} • $${res.cart.bestSingleStore.total.toFixed(2)}`} />
                  <Stat label="Best mixed plan" value={`$${res.cart.bestMixed.total.toFixed(2)} • ${res.cart.bestMixed.storesUsed.length} store(s)`} />
                  <Stat label="Savings vs worst" value={`$${res.cart.estimatedSavingsVsWorst.toFixed(2)}`} />
                </div>

                <div className="mt-5 rounded-2xl border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[780px] text-left text-sm">
                      <thead className="bg-slate-50 text-xs font-extrabold text-slate-700">
                        <tr>
                          <th className="px-4 py-3">Item</th>
                          <th className="px-4 py-3">Matched product</th>
                          {(["maxi", "metro", "provigo", "superc"] as StoreKey[]).map((s) => (
                            <th key={s} className="px-4 py-3">{STORE_LABEL[s]}</th>
                          ))}
                          <th className="px-4 py-3">Best</th>
                          <th className="px-4 py-3">Save</th>
                        </tr>
                      </thead>
                      <tbody>
                        {res.items.map((it, idx) => (
                          <tr key={idx} className="border-t border-slate-200">
                            <td className="px-4 py-3 font-semibold text-slate-900">{it.query}</td>
                            <td className="px-4 py-3">
                              <div className="flex flex-col">
                                <span className="font-semibold text-slate-900">
                                  {it.match?.name ?? "—"}
                                </span>
                                <span className="text-xs text-slate-600">
                                  {it.match?.confidence != null ? `Match ${(it.match.confidence * 100).toFixed(0)}%` : ""}
                                  {it.match?.needsReview ? " • Needs review" : ""}
                                </span>
                              </div>
                            </td>

                            {(["maxi", "metro", "provigo", "superc"] as StoreKey[]).map((s) => {
                              const p = it.prices?.[s];
                              const isBest = it.bestStore === s;
                              return (
                                <td key={s} className="px-4 py-3 tabular-nums">
                                  {p ? (
                                    <span className={`inline-flex items-center gap-2 rounded-lg px-2 py-1 ${isBest ? "bg-[color:var(--pc-green)]/15" : "bg-transparent"}`}>
                                      <span className="font-semibold text-slate-900">${p.unitPrice.toFixed(2)}/{p.unit}</span>
                                    </span>
                                  ) : (
                                    <span className="text-slate-400">—</span>
                                  )}
                                </td>
                              );
                            })}

                            <td className="px-4 py-3">
                              {it.bestStore ? (
                                <span className="rounded-lg bg-[color:var(--pc-green)]/15 px-2 py-1 text-xs font-extrabold text-slate-900">
                                  {STORE_LABEL[it.bestStore]}
                                </span>
                              ) : (
                                <span className="text-slate-400">—</span>
                              )}
                            </td>
                            <td className="px-4 py-3 font-extrabold tabular-nums text-slate-900">
                              {it.savingsVsNext != null ? `$${it.savingsVsNext.toFixed(2)}` : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="mt-5 rounded-2xl bg-cinematic-dark p-6 text-white">
                  <div className="text-sm font-extrabold">Suggested plan</div>
                  <p className="mt-1 text-xs text-white/80">
                    Based on your settings ({strategy === "min_total" ? "lowest total" : "fewer stores"}, max {maxStores} store(s)).
                  </p>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {(["maxi", "metro", "provigo", "superc"] as StoreKey[])
                      .filter((s) => res.cart.bestMixed.plan[s]?.length)
                      .map((s) => (
                        <div key={s} className="rounded-2xl bg-white/10 p-4">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-extrabold">{STORE_LABEL[s]}</span>
                            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--pc-green)] floaty" />
                          </div>
                          <ul className="mt-2 space-y-1 text-sm text-white/90">
                            {res.cart.bestMixed.plan[s].slice(0, 8).map((name) => (
                              <li key={name}>• {name}</li>
                            ))}
                            {res.cart.bestMixed.plan[s].length > 8 && (
                              <li className="text-white/70">+{res.cart.bestMixed.plan[s].length - 8} more</li>
                            )}
                          </ul>
                        </div>
                      ))}
                  </div>

                  <p className="mt-4 text-xs text-white/70">
                    Note: This MVP uses a mock comparer until your DB queries are wired into /api/compare.
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-extrabold text-slate-600">{label}</div>
      <div className="mt-1 text-lg font-extrabold text-slate-900">{value}</div>
    </div>
  );
}

function toCSV(res: CompareResponse) {
  const header = ["query","matched","maxi","metro","provigo","superc","bestStore","save"].join(",");
  const rows = res.items.map((it) => {
    const p = (s: StoreKey) => it.prices?.[s]?.unitPrice != null ? `$${it.prices[s]!.unitPrice.toFixed(2)}/${it.prices[s]!.unit}` : "";
    return [
      escapeCSV(it.query),
      escapeCSV(it.match?.name ?? ""),
      escapeCSV(p("maxi")),
      escapeCSV(p("metro")),
      escapeCSV(p("provigo")),
      escapeCSV(p("superc")),
      escapeCSV(it.bestStore ? STORE_LABEL[it.bestStore] : ""),
      escapeCSV(it.savingsVsNext != null ? `$${it.savingsVsNext.toFixed(2)}` : ""),
    ].join(",");
  });
  return [header, ...rows].join("\n");
}

function escapeCSV(s: string) {
  const t = (s ?? "").replace(/"/g, '""');
  if (/[",\n]/.test(t)) return `"${t}"`;
  return t;
}
