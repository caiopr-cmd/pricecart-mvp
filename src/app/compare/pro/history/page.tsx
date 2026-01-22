"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Calendar,
  TrendingDown,
  ShoppingCart,
  Search,
  ArrowLeft,
  Download,
  Trash2,
  Clock,
  MapPin,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";

/** MUST match ProComparePage */
const HISTORY_KEY = "PRICECART_PRO_COMPARE_HISTORY_V1";

type Strategy = "cheapest" | "one-stop" | "two-stop";

type CompareHistoryEntry = {
  id: string;
  createdAt: number;
  input: string;
  items: string[];
  totalSavings: number;
  strategy: Strategy;
  // optional if you decide to store it later
  stores?: string[];
};

function readHistory(): CompareHistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeHistory(next: CompareHistoryEntry[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
}

function strategyLabel(s: Strategy | "all") {
  if (s === "all") return "All";
  if (s === "cheapest") return "Max Savings";
  if (s === "one-stop") return "1-Stop";
  return "2-Stop";
}

function strategyBadgeClasses(s: Strategy) {
  if (s === "cheapest") return "bg-emerald-100 text-emerald-700";
  if (s === "one-stop") return "bg-indigo-100 text-indigo-700";
  return "bg-blue-100 text-blue-700";
}

function formatDateTime(ts: number) {
  const d = new Date(ts);
  const date = d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const time = d.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return { date, time };
}

export default function HistoryPage() {
  const [history, setHistory] = useState<CompareHistoryEntry[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterStrategy, setFilterStrategy] = useState<
    "all" | "cheapest" | "one-stop" | "two-stop"
  >("all");

  useEffect(() => {
    // initial load
    setHistory(readHistory());
    setHydrated(true);

    // sync if another tab updates it
    const onStorage = (e: StorageEvent) => {
      if (e.key === HISTORY_KEY) setHistory(readHistory());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const filteredHistory = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return history.filter((entry) => {
      const matchesSearch =
        q === "" ||
        entry.items.some((item) => item.toLowerCase().includes(q)) ||
        entry.input.toLowerCase().includes(q);

      const matchesFilter =
        filterStrategy === "all" || entry.strategy === filterStrategy;

      return matchesSearch && matchesFilter;
    });
  }, [history, searchQuery, filterStrategy]);

  const totalComparisons = history.length;
  const totalSavings = useMemo(
    () => history.reduce((sum, e) => sum + (Number(e.totalSavings) || 0), 0),
    [history]
  );
  const avgSavingsPerComparison =
    totalComparisons > 0 ? totalSavings / totalComparisons : 0;

  const handleDeleteEntry = (id: string) => {
    const next = history.filter((h) => h.id !== id);
    setHistory(next);
    writeHistory(next);
  };

  const handleExportAll = () => {
    const blob = new Blob([JSON.stringify(history, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "pricecart-comparison-history.json";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/20 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/compare/pro"
            className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4 transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 mb-2">
                Comparison History
              </h1>
              <p className="text-slate-600">
                Review your past price comparisons and savings
              </p>
            </div>

            <button
              type="button"
              onClick={handleExportAll}
              disabled={!hydrated || history.length === 0}
              className="px-5 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-300 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <Download className="w-5 h-5" />
              Export All
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
                <ShoppingCart className="w-5 h-5 text-emerald-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Total Comparisons
              </p>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {hydrated ? totalComparisons : "—"}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-5 h-5 text-green-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">Total Saved</p>
            </div>
            <p className="text-4xl font-black text-green-600">
              {hydrated ? `$${totalSavings.toFixed(2)}` : "—"}
            </p>
          </div>

          <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <p className="text-sm font-semibold text-slate-600">
                Avg per Comparison
              </p>
            </div>
            <p className="text-4xl font-black text-slate-900">
              {hydrated ? `$${avgSavingsPerComparison.toFixed(2)}` : "—"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by item name..."
                className="w-full pl-12 pr-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 placeholder:text-slate-400"
              />
            </div>

            {/* Strategy Filter */}
            <div className="flex flex-wrap gap-2">
              {(["all", "cheapest", "one-stop", "two-stop"] as const).map(
                (strategy) => (
                  <button
                    key={strategy}
                    type="button"
                    onClick={() => setFilterStrategy(strategy)}
                    className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                      filterStrategy === strategy
                        ? "bg-emerald-600 text-white shadow-lg"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {strategyLabel(strategy)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="space-y-4">
          {!hydrated ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-white/60 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Loading history…
              </h3>
              <p className="text-slate-600">One second.</p>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="bg-white/90 backdrop-blur-xl rounded-2xl p-12 shadow-lg border border-white/60 text-center">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                No results found
              </h3>
              <p className="text-slate-600">Try adjusting your search or filters</p>

              {history.length === 0 && (
                <div className="mt-6">
                  <Link
                    href="/compare/pro"
                    className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all"
                  >
                    Start Comparing
                    <ChevronRight className="w-5 h-5" />
                  </Link>
                </div>
              )}
            </div>
          ) : (
            filteredHistory.map((entry) => {
              const { date, time } = formatDateTime(entry.createdAt);
              const storesText =
                entry.stores && entry.stores.length > 0
                  ? entry.stores.join(", ")
                  : entry.strategy === "one-stop"
                  ? "1 store"
                  : "Multiple stores";

              return (
                <div
                  key={entry.id}
                  className="bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60 hover:shadow-xl transition-all group"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center">
                        <ShoppingCart className="w-6 h-6 text-emerald-700" />
                      </div>

                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-bold text-slate-900">
                            {entry.items.length}{" "}
                            {entry.items.length === 1 ? "item" : "items"}
                          </h3>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${strategyBadgeClasses(
                              entry.strategy
                            )}`}
                          >
                            {strategyLabel(entry.strategy)}
                          </span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-600">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {date} at {time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            {storesText}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right flex items-center justify-between sm:justify-end gap-3">
                      <div>
                        <p className="text-sm text-slate-600 mb-1">Saved</p>
                        <p className="text-3xl font-black text-green-600">
                          ${Number(entry.totalSavings || 0).toFixed(2)}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="p-2 hover:bg-red-50 rounded-lg transition-all text-slate-400 hover:text-red-600"
                        aria-label="Delete history entry"
                        title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Items List */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-200">
                    {entry.items.map((item, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium capitalize"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
