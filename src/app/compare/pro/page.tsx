"use client";

import React, { useEffect, useState } from 'react';
import Link from "next/link";
import { 
  TrendingDown, ShoppingCart, Check, Crown, ArrowRight, ArrowLeft, 
  Star, Bell, Save, History, Download, Sparkles, BarChart3,
  Plus, Trash2, X, Clock, MapPin, Zap, Target, Route,
  Wallet, ChevronRight, Filter, Search, Share2, ArrowUpDown
} from 'lucide-react';

// Mock data
const MOCK_PRODUCTS: { [key: string]: Array<{ store: string; name: string; price: number; unit: string; savings: number }> } = {
  'chicken': [
    { store: 'Maxi', name: 'Chicken Breast Boneless', price: 14.97, unit: 'kg', savings: 1.53 },
    { store: 'Super C', name: 'Chicken Breast Value Pack', price: 15.99, unit: 'kg', savings: 0.51 },
    { store: 'Metro', name: 'Chicken Breast Fillets', price: 16.51, unit: 'kg', savings: 0 },
    { store: 'Provigo', name: 'Free From Chicken Breast', price: 16.50, unit: 'kg', savings: 0.01 }
  ],
  'eggs': [
    { store: 'Super C', name: 'White Eggs Large 12ct', price: 4.79, unit: 'dozen', savings: 0.70 },
    { store: 'Maxi', name: 'Large White Eggs', price: 4.99, unit: 'dozen', savings: 0.50 },
    { store: 'Metro', name: 'Farm Fresh Eggs', price: 5.49, unit: 'dozen', savings: 0 },
    { store: 'Provigo', name: 'Omega-3 Eggs', price: 6.99, unit: 'dozen', savings: -1.50 }
  ],
  'milk': [
    { store: 'Super C', name: '2% Milk 2L', price: 4.99, unit: '2L', savings: 0.80 },
    { store: 'Maxi', name: '2% Milk 2L', price: 5.29, unit: '2L', savings: 0.50 },
    { store: 'Metro', name: 'Partly Skimmed 2L', price: 5.79, unit: '2L', savings: 0 },
    { store: 'Provigo', name: 'Organic Milk 2L', price: 7.99, unit: '2L', savings: -2.20 }
  ],
  'bread': [
    { store: 'Metro', name: 'Whole Wheat 675g', price: 2.49, unit: 'loaf', savings: 0.50 },
    { store: 'Super C', name: 'Whole Wheat 675g', price: 2.99, unit: 'loaf', savings: 0 },
    { store: 'Maxi', name: 'Whole Wheat 675g', price: 3.49, unit: 'loaf', savings: -0.50 },
    { store: 'Provigo', name: 'Organic Whole Wheat', price: 5.49, unit: 'loaf', savings: -3.00 }
  ]
};

const SAVED_LISTS = [
  { id: 1, name: 'Weekly Staples', items: 'chicken, eggs, milk, bread', lastUsed: '2 days ago', itemCount: 12 },
  { id: 2, name: 'Meal Prep', items: 'chicken, eggs', lastUsed: '1 week ago', itemCount: 8 },
  { id: 3, name: 'Quick Run', items: 'milk, bread', lastUsed: '3 days ago', itemCount: 5 }
];

const HISTORY_KEY = "PRICECART_PRO_COMPARE_HISTORY_V1";

type CompareHistoryEntry = {
  id: string;
  createdAt: number;
  input: string;
  items: string[];
  totalSavings: number;
  strategy: "cheapest" | "one-stop" | "two-stop";
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

export default function ProComparePage() {
  const [comparisonCount, setComparisonCount] = useState(0);

useEffect(() => {
  // initial load
  setComparisonCount(readHistory().length);

  // keep in sync if another tab updates it
  const onStorage = (e: StorageEvent) => {
    if (e.key === HISTORY_KEY) setComparisonCount(readHistory().length);
  };
  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}, []);
  const [input, setInput] = useState('');
  const [results, setResults] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedStrategy, setSelectedStrategy] = useState<'cheapest' | 'one-stop' | 'two-stop'>('cheapest');
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showCreateListModal, setShowCreateListModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListItems, setNewListItems] = useState('');
  const [savedLists, setSavedLists] = useState(SAVED_LISTS);

  const handleCompare = () => {
    if (!input.trim()) return;
    setLoading(true);
    
    setTimeout(() => {
      const items = input.toLowerCase().split(',').map(i => i.trim()).filter(Boolean);
      const comparisonData = items.map(item => {
        const matches = MOCK_PRODUCTS[item] || [];
        const sorted = [...matches].sort((a, b) => a.price - b.price);
        return {
          item,
          found: matches.length > 0,
          best: sorted[0],
          allPrices: sorted
        };
      });

      const totalSavings = comparisonData.reduce((sum, item) => 
        sum + (item.best?.savings || 0), 0
      );

      // Group items by best store
      const storeGroups: { [key: string]: any[] } = {};
      comparisonData.forEach(item => {
        if (item.best) {
          if (!storeGroups[item.best.store]) {
            storeGroups[item.best.store] = [];
          }
          storeGroups[item.best.store].push(item);
        }
      });

      const entry: CompareHistoryEntry = {
  id: crypto?.randomUUID ? crypto.randomUUID() : String(Date.now()),
  createdAt: Date.now(),
  input: input.trim(),
  items,
  totalSavings: Number(totalSavings.toFixed(2)),
  strategy: selectedStrategy,
};

const prev = readHistory();
const next = [entry, ...prev];
writeHistory(next);
setComparisonCount(next.length);

      setResults({
        items: comparisonData,
        totalSavings: totalSavings.toFixed(2),
        itemCount: items.length,
        storeGroups
      });
      
      setLoading(false);
      setShowPriceBreakdown(false);
    }, 800);
  };

  // Calculate shopping plan based on selected strategy
  const getShoppingPlan = () => {
    if (!results) return null;

    const { items, storeGroups } = results;
    
       if (selectedStrategy === 'cheapest') {
      // Cheapest: Buy each item at its cheapest store
      return Object.entries(storeGroups).map(([store, storeItems]) => ({
        store,
        items: storeItems,
        savings: (storeItems as any[]).reduce((sum, item) => sum + (item.best?.savings || 0), 0),
        isOneStop: false
      }));
    }
    
    if (selectedStrategy === 'one-stop') {
      // One-stop: Find the store with most items, buy everything there
      const storeCounts = Object.entries(storeGroups).map(([store, items]) => ({
        store,
        count: (items as any[]).length
      }));
      const bestStore = storeCounts.reduce((best, current) => 
        current.count > best.count ? current : best
      );
      
      // Calculate savings when buying ALL items at this one store
      const allItemsAtStore = items.map((item: any) => {
        const itemAtStore = item.allPrices?.find((p: any) => p.store === bestStore.store);
        return {
          ...item,
          priceAtStore: itemAtStore?.price || item.best?.price,
          savingsAtStore: itemAtStore ? (item.best.price - itemAtStore.price) : 0
        };
      });
      
      const totalSavingsOneStop = allItemsAtStore.reduce((sum: number, item: any) => 
        sum + item.savingsAtStore, 0
      );
      
      return [{
        store: bestStore.store,
        items: allItemsAtStore,
        savings: totalSavingsOneStop,
        isOneStop: true
      }];
    }
    
    if (selectedStrategy === 'two-stop') {
      // Two-stop: Top 2 stores by item count
      const sortedStores = Object.entries(storeGroups)
        .sort(([, a], [, b]) => (b as any[]).length - (a as any[]).length)
        .slice(0, 2);
      
      return sortedStores.map(([store, storeItems]) => ({
        store,
        items: storeItems,
        savings: (storeItems as any[]).reduce((sum, item) => sum + (item.best?.savings || 0), 0),
        isOneStop: false
      }));
    }
    
    return [];
  };

  const shoppingPlan = getShoppingPlan();
  const planTotalSavings = shoppingPlan?.reduce((sum, stop) => sum + stop.savings, 0) || 0;

  // Handle creating new list
  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    const newList = {
      id: Date.now(),
      name: newListName.trim(),
      items: newListItems.trim(),
      lastUsed: 'Just now',
      itemCount: newListItems.trim() ? newListItems.split(',').filter(i => i.trim()).length : 0
    };
    
    setSavedLists([newList, ...savedLists]);
    setNewListName('');
    setNewListItems('');
    setShowCreateListModal(false);
  };

  // Open modal with current input pre-filled
  const openCreateListModal = () => {
    setNewListItems(input);
    setShowCreateListModal(true);
  };

  // Handle deleting a list
  const handleDeleteList = (listId: number, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the list selection
    setSavedLists(savedLists.filter(list => list.id !== listId));
  };

  // INITIAL STATE - Centered, prominent input
  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/20 py-8 sm:py-12">
        <main className="max-w-5xl mx-auto px-4 sm:px-6">
          
          {/* Pro Status Banner */}
          <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
              <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-100 to-amber-200 rounded-full">
                <Crown className="w-5 h-5 text-amber-700" />
                <span className="text-sm font-black text-amber-900 uppercase tracking-wide">Pro Member</span>
              </div>
              <div className="text-sm text-slate-600">
                <span className="font-semibold text-slate-900">Montreal North</span> • 4 chains monitored
              </div>
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
             {/* Mobile compact link */}
<Link
  href="/compare/pro/history"
  className="sm:hidden inline-flex items-center justify-between gap-3 w-full
             px-4 py-3 bg-white/90 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60
             hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-emerald-100"
  aria-label="View comparison history"
>
  <div className="flex items-center gap-2">
    <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
      <ShoppingCart className="w-4 h-4 text-emerald-600" />
    </div>
    <span className="text-sm font-semibold text-slate-700">History</span>
  </div>
  <div className="flex items-center gap-2">
    <span className="text-lg font-black text-slate-900">{comparisonCount}</span>
    <ChevronRight className="w-4 h-4 text-emerald-700" />
  </div>
</Link>

{/* Desktop card */}
<Link
  href="/compare/pro/history"
  className="hidden sm:block group bg-white/90 backdrop-blur-xl rounded-2xl p-6 shadow-lg border border-white/60
             hover:shadow-xl hover:-translate-y-0.5 transition-all focus:outline-none focus:ring-4 focus:ring-emerald-100"
  aria-label="View comparison history"
>
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center">
      <ShoppingCart className="w-5 h-5 text-emerald-600" />
    </div>
    <p className="text-sm font-semibold text-slate-600">Total Comparisons</p>
  </div>

  <div className="flex items-end justify-between">
    <p className="text-4xl font-black text-slate-900">{comparisonCount}</p>
    <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-700 opacity-0 group-hover:opacity-100 transition-opacity">
      View history <ChevronRight className="w-4 h-4" />
    </span>
  </div>
</Link>


              <div className="px-4 py-2 bg-emerald-50 rounded-full border border-emerald-200 text-sm">
                <span className="font-bold text-emerald-700">Saved $183.45 this month</span>
              </div>
            </div>
          </div>

          {/* Main Input Card - Hero Style */}
          <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 shadow-2xl border border-white/60 mb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl sm:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                What's on your <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">shopping list?</span>
              </h1>
              <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto">
                Enter your items below and we'll find the best prices across all Montreal stores instantly.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="chicken, eggs, milk, bread, pasta, ground beef, bananas, apples..."
                rows={6}
                className="w-full p-4 sm:p-6 bg-slate-50 border-2 border-slate-200 rounded-3xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-base sm:text-lg text-slate-700 placeholder:text-slate-400 resize-none font-medium mb-6"
              />

              <button
                onClick={handleCompare}
                disabled={loading || !input.trim()}
                className="w-full py-4 sm:py-5 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-bold text-lg sm:text-xl transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-3 shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing prices...
                  </>
                ) : (
                  <>
                    <Zap className="w-6 h-6 fill-current" />
                    Analyze Prices
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>

              <p className="text-center text-sm text-slate-500 mt-4">
                Pro members get unlimited comparisons • No credit card required
              </p>
            </div>
          </div>

          {/* Quick Start Examples */}
          <div className="text-center mb-8">
            <p className="text-sm text-slate-600 mb-4 font-semibold">Try these examples:</p>
            <div className="flex flex-wrap gap-3 justify-center">
              {[
                { label: 'Weekly Staples', items: 'chicken, eggs, milk, bread' },
                { label: 'Meal Prep', items: 'chicken, ground beef, pasta' },
                { label: 'Breakfast Items', items: 'eggs, milk, bread' }
              ].map((example) => (
                <button
                  key={example.label}
                  onClick={() => setInput(example.items)}
                  className="px-5 py-3 bg-white/80 backdrop-blur-sm hover:bg-emerald-50 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-2xl text-sm font-semibold transition-all shadow-sm hover:shadow-md"
                >
                  {example.label}
                </button>
              ))}
            </div>
          </div>

        {/* Recent Lists */}
<div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-lg border border-white/60">
  <div className="flex items-center justify-between mb-6">
    <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
      <History className="w-6 h-6 text-slate-600" />
      Recent Lists
    </h3>
    <button
      type="button"
      onClick={openCreateListModal}
      className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-xl transition-all"
      aria-label="Create new list"
    >
      <Plus className="w-5 h-5" />
    </button>
  </div>

  <div className="grid md:grid-cols-3 gap-4">
    {savedLists.map((list) => (
      <div
        key={list.id}
        role="button"
        tabIndex={0}
        onClick={() => setInput(list.items)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            setInput(list.items);
          }
        }}
        className="group p-5 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-indigo-50
                   border-2 border-transparent hover:border-emerald-200 transition-all cursor-pointer
                   text-left relative focus:outline-none focus:ring-4 focus:ring-emerald-100"
        aria-label={`Use list ${list.name}`}
      >
        {/* Delete button */}
        <button
          type="button"
          onClick={(e) => handleDeleteList(list.id, e)}
          className="absolute top-3 right-3 p-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg
                     opacity-0 group-hover:opacity-100 transition-all z-10"
          title="Delete list"
          aria-label={`Delete list ${list.name}`}
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all shadow-sm">
            <ShoppingCart className="w-6 h-6 text-slate-600 group-hover:text-emerald-700" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800">{list.name}</p>
            <p className="text-sm text-slate-500">{list.itemCount} items</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
        </div>

        <p className="text-xs text-slate-500">Last used {list.lastUsed}</p>
      </div>
    ))}
  </div>
</div>
        </main>

        {/* Create List Modal */}
        {showCreateListModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-slate-900">Create Shopping List</h3>
                <button 
                  onClick={() => {
                    setShowCreateListModal(false);
                    setNewListName('');
                    setNewListItems('');
                  }}
                  className="p-2 hover:bg-slate-100 rounded-xl transition-all"
                >
                  <X className="w-6 h-6 text-slate-600" />
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  List Name *
                </label>
                <input
                  type="text"
                  value={newListName}
                  onChange={(e) => setNewListName(e.target.value)}
                  placeholder="e.g., Weekly Groceries"
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 placeholder:text-slate-400"
                  autoFocus
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Items (optional)
                </label>
                <textarea
                  value={newListItems}
                  onChange={(e) => setNewListItems(e.target.value)}
                  placeholder="chicken, eggs, milk, bread..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-50 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100 transition-all text-slate-700 placeholder:text-slate-400 resize-none"
                />
                {newListItems.trim() && (
                  <p className="text-xs text-slate-500 mt-2">
                    {newListItems.split(',').filter(i => i.trim()).length} items
                  </p>
                )}
              </div>

              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tip:</strong> Separate items with commas. You can save an empty list and add items later.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <button
                  onClick={() => {
                    setShowCreateListModal(false);
                    setNewListName('');
                    setNewListItems('');
                  }}
                  className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateList}
                  disabled={!newListName.trim()}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-xl font-bold transition-all disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  Save List
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // RESULTS STATE - Sidebar layout
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/20 to-indigo-50/20 py-8">
      <main className="max-w-7xl mx-auto px-4 sm:px-6">
        <button
  type="button"
  onClick={() => {
    setShowPriceBreakdown(false);
    setResults(null); // ✅ goes back to the big input screen
  }}
  className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-5 transition-all group font-semibold"
>
  <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
  Back to big input
</button>
        <div className="grid lg:grid-cols-12 gap-6">
          
          {/* LEFT SIDEBAR - Control Panel */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Pro Status Card */}
            <div className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2rem] p-8 text-white shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-indigo-500/10"></div>
              <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <Crown className="w-5 h-5 text-amber-400" />
                  <span className="text-xs font-black uppercase tracking-widest text-amber-400/90">Unlimited Member</span>
                </div>
                <h2 className="text-3xl font-black mb-2">Montreal North</h2>
                <p className="text-slate-300 text-sm mb-6">4 chains monitored in your area</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <a 
                    href="/compare/pro/history"
                    className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 hover:bg-white/15 transition-all cursor-pointer group"
                  >
                    <p className="text-xs text-slate-400 mb-1">Comparisons</p>
                    <p className="text-3xl font-black group-hover:scale-110 transition-transform">{comparisonCount}</p>
                    <p className="text-xs text-slate-300 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">View history →</p>
                  </a>
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10">
                    <p className="text-xs text-slate-400 mb-1">Efficiency</p>
                    <p className="text-3xl font-black">94%</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Input Box */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider flex items-center gap-2">
                  <Search className="w-4 h-4" /> New Comparison
                </h3>
                <button 
                  onClick={() => setResults(null)}
                  className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold"
                >
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="chicken, eggs, milk, bread..."
                className="w-full h-32 p-4 bg-slate-50/80 border-none rounded-2xl focus:ring-2 focus:ring-emerald-500 transition-all text-slate-700 placeholder:text-slate-400 resize-none font-medium"
              />
              <button
                onClick={handleCompare}
                disabled={loading || !input.trim()}
                className="w-full mt-4 py-4 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 disabled:from-slate-300 disabled:to-slate-400 text-white rounded-2xl font-bold transition-all transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-emerald-200 active:scale-[0.98] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5 fill-current" />
                    Analyze Prices
                  </>
                )}
              </button>
            </div>

            {/* Saved Lists */}
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-lg border border-white/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                  <History className="w-5 h-5 text-slate-600" />
                  Recent Lists
                </h3>
                <button 
                  onClick={openCreateListModal}
                  className="text-emerald-600 p-2 hover:bg-emerald-50 rounded-xl transition-all"
                >
                  <Plus className="w-5 h-5"/>
                </button>
              </div>
              <div className="space-y-2">
                {savedLists.map((list) => (
                  <button
                    key={list.id}
                    onClick={() => setInput(list.items)}
                    className="group w-full flex items-center justify-between p-4 rounded-2xl hover:bg-gradient-to-r hover:from-emerald-50 hover:to-indigo-50 border border-transparent hover:border-emerald-200/50 transition-all cursor-pointer relative"
                  >
                    {/* Delete button */}
                    <button
                      onClick={(e) => handleDeleteList(list.id, e)}
                      className="absolute top-2 right-2 p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-all z-10"
                      title="Delete list"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>

                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-slate-100 to-slate-200 rounded-xl flex items-center justify-center group-hover:from-emerald-100 group-hover:to-emerald-200 transition-all shadow-sm">
                        <ShoppingCart className="w-5 h-5 text-slate-600 group-hover:text-emerald-700" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-slate-800">{list.name}</p>
                        <p className="text-xs text-slate-500">{list.itemCount} items • {list.lastUsed}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-emerald-600 transition-all group-hover:translate-x-1" />
                  </button>
                ))}
              </div>
  </div>
</div>

{/* RIGHT CONTENT AREA */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Savings Hero */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-2xl border border-white/60 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-indigo-500/5"></div>
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-gradient-to-br from-emerald-400/10 to-emerald-600/10 rounded-full blur-3xl"></div>
              
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                <div>
                  <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-emerald-100 to-emerald-200 text-emerald-800 rounded-full text-xs font-black uppercase tracking-tight mb-4 shadow-sm">
                    <Sparkles className="w-3 h-3" />
                    {selectedStrategy === 'cheapest' ? 'Maximum Savings' : selectedStrategy === 'one-stop' ? 'Most Convenient' : 'Balanced Approach'}
                  </span>
                  <h1 className="text-4xl sm:text-6xl font-black text-slate-900 mb-3 tracking-tight">
                    Save <span className="bg-gradient-to-r from-emerald-600 to-emerald-700 bg-clip-text text-transparent">${planTotalSavings.toFixed(2)}</span>
                  </h1>
                  <p className="text-slate-600 max-w-md leading-relaxed">
                    {selectedStrategy === 'cheapest' 
                      ? 'Get the absolute best price on every item by visiting multiple stores.'
                      : selectedStrategy === 'one-stop'
                      ? 'Get everything at one store for maximum convenience.'
                      : 'Visit two stores for a good balance of savings and convenience.'}
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Download className="w-4 h-4" /> Export
                  </button>
                  <button className="px-6 py-3 bg-gradient-to-r from-emerald-50 to-emerald-100 hover:from-emerald-100 hover:to-emerald-200 text-emerald-800 rounded-xl font-bold transition-all flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Share
                  </button>
                </div>
              </div>
            </div>

            {/* Strategy Selector */}
            <div className="grid md:grid-cols-3 gap-4">
              <button
                onClick={() => setSelectedStrategy('one-stop')}
                className={`p-6 rounded-[2rem] border-2 transition-all ${
                  selectedStrategy === 'one-stop'
                    ? 'border-indigo-500 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-xl shadow-indigo-100 scale-[1.02]'
                    : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-indigo-200 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    selectedStrategy === 'one-stop'
                      ? 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white shadow-lg shadow-indigo-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Target className="w-6 h-6"/>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">One-Stop Shop</h4>
                <p className="text-xs text-slate-600 mt-2">Most convenient - everything at one store</p>
              </button>

              <button
                onClick={() => setSelectedStrategy('two-stop')}
                className={`p-6 rounded-[2rem] border-2 transition-all ${
                  selectedStrategy === 'two-stop'
                    ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-cyan-50 shadow-xl shadow-blue-100 scale-[1.02]'
                    : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-blue-200 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    selectedStrategy === 'two-stop'
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <Route className="w-6 h-6"/>
                  </div>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Two-Stop Plan</h4>
                <p className="text-xs text-slate-600 mt-2">Balance savings and convenience</p>
              </button>

              <button
                onClick={() => setSelectedStrategy('cheapest')}
                className={`p-6 rounded-[2rem] border-2 transition-all ${
                  selectedStrategy === 'cheapest'
                    ? 'border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 shadow-xl shadow-emerald-100 scale-[1.02]'
                    : 'border-slate-200 bg-white/80 backdrop-blur-sm hover:border-emerald-200 hover:shadow-lg'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-sm ${
                    selectedStrategy === 'cheapest'
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-200'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    <TrendingDown className="w-6 h-6"/>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-emerald-700">
                    ⭐ Max Savings
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1">Cheapest Prices</h4>
                <p className="text-xs text-slate-600 mt-2">Best price on every single item</p>
              </button>
            </div>

            {/* Smart Shopping Plan */}
            <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] p-8 shadow-xl border border-white/60">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">Your Shopping Plan</h2>
                  <p className="text-slate-600">
                    {shoppingPlan?.length === 1 ? 'One-stop shopping - get everything here' : `${shoppingPlan?.length}-stop strategy`}
                  </p>
                </div>
                <button
                  onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                  className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-all flex items-center gap-2"
                >
                  <BarChart3 className="w-4 h-4" />
                  {showPriceBreakdown ? 'Hide' : 'Show'} Price Details
                </button>
              </div>

              {/* Store-by-Store Shopping List */}
              <div className="space-y-6">
                {shoppingPlan?.map((stop, storeIdx) => (
                  <div key={stop.store} className="relative">
                    {/* Store Header */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl font-black text-xl shadow-lg shadow-emerald-200">
                        {storeIdx + 1}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-black text-slate-900">{stop.store}</h3>
                        <p className="text-sm text-slate-600">
                          {stop.items.length} {stop.items.length === 1 ? 'item' : 'items'}
                          {stop.savings > 0 && ` • Save ${stop.savings.toFixed(2)}`}
                        </p>
                      </div>
                      <MapPin className="w-6 h-6 text-slate-400" />
                    </div>

                    {/* Items Grid */}
                    <div className="grid md:grid-cols-2 gap-3 ml-0 sm:ml-16">
                      {stop.items.map((item: any, idx: number) => {
                        const displayPrice = stop.isOneStop ? item.priceAtStore : item.best.price;
                        const displaySavings = stop.isOneStop ? item.savingsAtStore : item.best.savings;
                        
                        return (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-4 bg-gradient-to-r from-slate-50 to-emerald-50/50 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all group"
                          >
                            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform">
                              {item.item === 'chicken' ? '🍗' : item.item === 'eggs' ? '🥚' : item.item === 'milk' ? '🥛' : '🍞'}
                            </div>
                            <div className="flex-1">
                              <p className="font-bold text-slate-900 capitalize">{item.item}</p>
                              <p className="text-sm text-slate-600">
                                ${displayPrice?.toFixed(2)} per {stop.isOneStop ? item.best?.unit : item.best.unit}
                              </p>
                            </div>
                            {displaySavings > 0 && (
                              <div className="text-right">
                                <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-1 rounded-lg">
                                  -${displaySavings.toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* Connector line to next stop */}
                    {storeIdx < (shoppingPlan?.length || 0) - 1 && (
                      <div className="flex items-center gap-3 my-6 ml-0 sm:ml-6">
                        <div className="w-0.5 h-8 bg-slate-200"></div>
                        <ChevronRight className="w-5 h-5 text-slate-400 rotate-90" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Total Summary */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between p-6 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-2xl">
                  <div>
                    <p className="text-sm font-semibold text-emerald-800 mb-1">Total Savings with This Strategy</p>
                    <p className="text-4xl font-black text-emerald-900">${planTotalSavings.toFixed(2)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-emerald-700">vs. most expensive options</p>
                    {selectedStrategy !== 'cheapest' && (
                      <p className="text-xs text-slate-600 mt-1">
                        Switch to "Cheapest Prices" to save ${results.totalSavings}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown - Only shown when toggled */}
            {showPriceBreakdown && (
              <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-xl border border-white/60 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/50 to-transparent">
                  <h3 className="font-black text-lg text-slate-900">Detailed Price Comparison</h3>
                  <div className="flex gap-2">
                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                      <Filter className="w-5 h-5"/>
                    </button>
                    <button className="p-2 hover:bg-slate-100 rounded-xl text-slate-500 transition-all">
                      <ArrowUpDown className="w-5 h-5"/>
                    </button>
                  </div>
                </div>
                
                <div className="divide-y divide-slate-100">
                  {results.items.map((item: any, idx: number) => (
                    item.found && (
                      <div key={idx} className="p-6 hover:bg-gradient-to-r hover:from-slate-50/50 hover:to-transparent transition-all">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-gradient-to-br from-slate-100 to-slate-200 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                              {idx === 0 ? '🍗' : idx === 1 ? '🥚' : idx === 2 ? '🥛' : '🍞'}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 capitalize mb-1">{item.item}</p>
                              <p className="text-sm text-slate-500">{item.best?.name}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-lg mb-2">
                              <Check className="w-3 h-3" />
                              BEST PRICE
                            </span>
                            <p className="text-2xl font-black text-slate-900">${item.best?.price.toFixed(2)}</p>
                            <p className="text-xs text-slate-500">per {item.best?.unit}</p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                          {item.allPrices.map((store: any, storeIdx: number) => (
                            <div 
                              key={storeIdx}
                              className={`px-3 py-2.5 rounded-xl text-center border transition-all ${
                                storeIdx === 0 
                                  ? 'bg-gradient-to-br from-emerald-600 to-emerald-700 border-emerald-600 text-white shadow-lg shadow-emerald-200 scale-105' 
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              <p className="text-[10px] font-black uppercase tracking-tight opacity-80 mb-1">
                                {store.store}
                              </p>
                              <p className="text-sm font-bold">${store.price.toFixed(2)}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}