"use client";

import React, { useState } from 'react';
import { 
  TrendingDown, ShoppingCart, Check, Crown, ArrowRight, 
  Star, Bell, Save, History, Download, Sparkles, BarChart3,
  Plus, Trash2, Edit2, X, Clock, MapPin, Zap, Target, Route
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
  ],
  'ground beef': [
    { store: 'Maxi', name: 'Lean Ground Beef', price: 9.99, unit: 'kg', savings: 1.50 },
    { store: 'Super C', name: 'Ground Beef Medium', price: 10.49, unit: 'kg', savings: 1.00 },
    { store: 'Metro', name: 'Ground Beef Lean', price: 11.49, unit: 'kg', savings: 0 },
    { store: 'Provigo', name: 'Organic Ground Beef', price: 13.99, unit: 'kg', savings: -2.50 }
  ],
  'pasta': [
    { store: 'Super C', name: 'Spaghetti 900g', price: 1.99, unit: 'box', savings: 0.80 },
    { store: 'Maxi', name: 'Penne 900g', price: 2.29, unit: 'box', savings: 0.50 },
    { store: 'Metro', name: 'Fusilli 900g', price: 2.79, unit: 'box', savings: 0 },
    { store: 'Provigo', name: 'Organic Pasta 900g', price: 4.99, unit: 'box', savings: -2.20 }
  ],
  'bananas': [
    { store: 'Super C', name: 'Bananas Yellow', price: 0.79, unit: 'lb', savings: 0.30 },
    { store: 'Maxi', name: 'Fresh Bananas', price: 0.89, unit: 'lb', savings: 0.20 },
    { store: 'Metro', name: 'Bananas', price: 1.09, unit: 'lb', savings: 0 },
    { store: 'Provigo', name: 'Organic Bananas', price: 1.49, unit: 'lb', savings: -0.40 }
  ],
  'apples': [
    { store: 'Maxi', name: 'McIntosh Apples', price: 2.99, unit: 'lb', savings: 0.50 },
    { store: 'Super C', name: 'Red Apples', price: 3.29, unit: 'lb', savings: 0.20 },
    { store: 'Metro', name: 'Gala Apples', price: 3.49, unit: 'lb', savings: 0 },
    { store: 'Provigo', name: 'Honeycrisp', price: 4.99, unit: 'lb', savings: -1.50 }
  ]
};

const SAVED_LISTS = [
  { id: 1, name: 'Weekly Groceries', items: 'chicken, eggs, milk, bread', lastUsed: '2 days ago' },
  { id: 2, name: 'Meal Prep Sunday', items: 'ground beef, pasta, chicken, eggs', lastUsed: '1 week ago' },
  { id: 3, name: 'Quick Staples', items: 'milk, bread, eggs', lastUsed: '3 days ago' }
];

interface ComparisonResult {
  items: Array<{
    item: string;
    found: boolean;
    best?: { store: string; name: string; price: number; unit: string; savings: number };
    allPrices: Array<{ store: string; name: string; price: number; unit: string; savings: number }>;
  }>;
  totalSavings: string;
  topStore: string;
  itemCount: number;
}

interface ShoppingPlan {
  stops: Array<{
    store: string;
    items: string[];
    totalItems: number;
    estimatedSavings: number;
  }>;
  totalSavings: number;
  description: string;
}

export default function ProComparePage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showAlertsModal, setShowAlertsModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'1-stop' | '2-stop' | '3-stop'>('1-stop');
  const [totalComparisonsThisMonth, setTotalComparisonsThisMonth] = useState(47);
  const [totalSavingsThisMonth, setTotalSavingsThisMonth] = useState(183.45);

  // Generate shopping plans
  const generateShoppingPlans = (comparisonData: any[]): { oneStop: ShoppingPlan; twoStop: ShoppingPlan; threeStop: ShoppingPlan } => {
    // Count best prices per store
    const storeCounts: { [key: string]: { count: number; items: string[]; savings: number } } = {};
    
    comparisonData.forEach(item => {
      if (item.best) {
        if (!storeCounts[item.best.store]) {
          storeCounts[item.best.store] = { count: 0, items: [], savings: 0 };
        }
        storeCounts[item.best.store].count++;
        storeCounts[item.best.store].items.push(item.item);
        storeCounts[item.best.store].savings += item.best.savings;
      }
    });

    // Get store keys and handle empty case
    const storeKeys = Object.keys(storeCounts);
    
    // 1-Stop Plan: Store with most best prices
    const bestStore = storeKeys.length > 0 
      ? storeKeys.reduce((a, b) => storeCounts[a].count > storeCounts[b].count ? a : b)
      : 'Maxi'; // Default fallback

    const oneStopItems = comparisonData.map(item => item.item);
    const oneStopSavings = comparisonData.reduce((sum, item) => {
      const itemAtStore = item.allPrices?.find((p: any) => p.store === bestStore);
      return sum + (itemAtStore ? itemAtStore.savings : 0);
    }, 0);

    // 2-Stop Plan: Best store + highest savings store for remaining items
    const sortedStores = Object.entries(storeCounts)
      .sort(([, a], [, b]) => b.count - a.count);
    
    const secondBestStore = sortedStores[1]?.[0] || sortedStores[0]?.[0] || 'Super C';
    const twoStopSavings = comparisonData.reduce((sum, item) => 
      sum + (item.best?.savings || 0), 0
    );

    // 3-Stop Plan: Optimize for maximum savings
    const thirdStore = sortedStores[2]?.[0] || sortedStores[1]?.[0];
    const threeStopStores = [bestStore, secondBestStore, thirdStore].filter(Boolean);

    return {
      oneStop: {
        stops: [{
          store: bestStore,
          items: oneStopItems,
          totalItems: oneStopItems.length,
          estimatedSavings: oneStopSavings
        }],
        totalSavings: oneStopSavings,
        description: `Get everything at ${bestStore}. It has the best prices or close matches on most items, making it your most convenient single-stop option.`
      },
      twoStop: {
        stops: [
          {
            store: bestStore,
            items: storeCounts[bestStore]?.items || [],
            totalItems: storeCounts[bestStore]?.count || 0,
            estimatedSavings: storeCounts[bestStore]?.savings || 0
          },
          {
            store: secondBestStore,
            items: storeCounts[secondBestStore]?.items || [],
            totalItems: storeCounts[secondBestStore]?.count || 0,
            estimatedSavings: storeCounts[secondBestStore]?.savings || 0
          }
        ],
        totalSavings: twoStopSavings,
        description: `Split between ${bestStore} for the bulk of your list and ${secondBestStore} for the items where they have significantly better prices. This hits the biggest savings without overcomplicating your trip.`
      },
      threeStop: {
        stops: threeStopStores.map(store => ({
          store,
          items: storeCounts[store]?.items || [],
          totalItems: storeCounts[store]?.count || 0,
          estimatedSavings: storeCounts[store]?.savings || 0
        })),
        totalSavings: twoStopSavings,
        description: `For maximum savings, visit all three stores where you have the absolute best prices. Only worth it if these stores are conveniently located near each other or on your usual route.`
      }
    };
  };

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

      const storeCounts: { [key: string]: number } = {};
      comparisonData.forEach(item => {
        if (item.best) {
          storeCounts[item.best.store] = (storeCounts[item.best.store] || 0) + 1;
        }
      });

      const topStore = Object.keys(storeCounts).reduce((a, b) => 
        storeCounts[a] > storeCounts[b] ? a : b, ''
      );

      setResults({
        items: comparisonData,
        totalSavings: totalSavings.toFixed(2),
        topStore,
        itemCount: items.length
      });
      
      setTotalComparisonsThisMonth(prev => prev + 1);
      setTotalSavingsThisMonth(prev => prev + parseFloat(totalSavings.toFixed(2)));
      setLoading(false);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) handleCompare();
  };

  const loadSavedList = (items: string) => {
    setInput(items);
    setResults(null);
  };

  const exportResults = () => {
    if (!results) return;
    const data = JSON.stringify(results, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pricecart-comparison.json';
    a.click();
  };

  const plans = results ? generateShoppingPlans(results.items) : null;
  const currentPlan = plans ? plans[selectedPlan === '1-stop' ? 'oneStop' : selectedPlan === '2-stop' ? 'twoStop' : 'threeStop'] : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Pro Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                  PriceCart Pro
                  <span className="text-lg bg-gradient-to-r from-amber-400 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    UNLIMITED
                  </span>
                </h1>
                <p className="text-gray-600">Compare unlimited items, save more every week</p>
              </div>
            </div>
            
            {/* Pro Stats */}
            <div className="hidden md:flex gap-6">
              <div className="text-right">
                <p className="text-sm text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-amber-600">{totalComparisonsThisMonth}</p>
                <p className="text-xs text-gray-500">comparisons</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Total Saved</p>
                <p className="text-2xl font-bold text-green-600">${totalSavingsThisMonth.toFixed(2)}</p>
                <p className="text-xs text-gray-500">this month</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Sidebar - Saved Lists */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-gray-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" />
                  Saved Lists
                </h2>
                <button className="p-1 hover:bg-gray-100 rounded-lg transition">
                  <Plus className="w-5 h-5 text-gray-600" />
                </button>
              </div>
              
              <div className="space-y-2">
                {SAVED_LISTS.map(list => (
                  <button
                    key={list.id}
                    onClick={() => loadSavedList(list.items)}
                    className="w-full text-left p-3 rounded-lg hover:bg-amber-50 transition group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900 group-hover:text-amber-600 transition">
                          {list.name}
                        </p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-1">
                          {list.items}
                        </p>
                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {list.lastUsed}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Pro Features Quick Access */}
              <div className="mt-6 pt-6 border-t border-gray-200 space-y-2">
                <button 
                  onClick={() => setShowAlertsModal(true)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-blue-50 transition text-left"
                >
                  <Bell className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">Price Alerts</p>
                    <p className="text-xs text-gray-600">3 active</p>
                  </div>
                </button>

                <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-purple-50 transition text-left">
                  <History className="w-5 h-5 text-purple-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">History</p>
                    <p className="text-xs text-gray-600">View past comparisons</p>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Quick Compare Input */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
              <div className="flex items-center justify-between mb-4">
                <label className="block text-lg font-semibold text-gray-900">
                  What are you shopping for?
                </label>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition" title="Voice input">
                    <Sparkles className="w-5 h-5 text-amber-600" />
                  </button>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-4">
                Enter items separated by commas • Pro: Unlimited comparisons • Press Ctrl+Enter to compare
              </p>
              
              <div className="space-y-4">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="chicken breast, eggs, 2% milk, whole wheat bread, ground beef, pasta..."
                  rows={3}
                  className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition resize-none"
                />
                
                <div className="flex gap-3">
                  <button
                    onClick={handleCompare}
                    disabled={!input.trim() || loading}
                    className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                        Comparing Prices...
                      </>
                    ) : (
                      <>
                        <TrendingDown className="w-6 h-6" />
                        Compare Prices
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </button>
                  
                  {input.trim() && (
                    <button
                      onClick={() => setShowSaveModal(true)}
                      className="px-6 py-4 bg-white border-2 border-amber-500 text-amber-600 rounded-xl hover:bg-amber-50 transition font-semibold flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Save List
                    </button>
                  )}
                </div>
              </div>

              {/* Pro Features Strip */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-2">
                      <Crown className="w-5 h-5 text-amber-600" />
                    </div>
                    <p className="text-xs text-gray-600">Unlimited</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2">
                      <Bell className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-xs text-gray-600">Price Alerts</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mb-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                    </div>
                    <p className="text-xs text-gray-600">Price History</p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2">
                      <Download className="w-5 h-5 text-green-600" />
                    </div>
                    <p className="text-xs text-gray-600">Export Data</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && plans && currentPlan && (
              <>
                {/* Enhanced Savings Card */}
                <div className="bg-gradient-to-br from-green-600 via-green-700 to-emerald-700 rounded-2xl shadow-2xl p-8 mb-6 text-white">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-green-100 text-lg mb-2">Potential savings</p>
                      <p className="text-6xl md:text-7xl font-bold">
                        ${results.totalSavings}
                      </p>
                      <p className="text-xl text-green-50 mt-2">
                        on this shopping trip
                      </p>
                    </div>
                    
                    <button
                      onClick={exportResults}
                      className="bg-white/20 backdrop-blur border-2 border-white/30 text-white px-4 py-3 rounded-xl hover:bg-white/30 transition flex items-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Export
                    </button>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="text-green-100 text-sm mb-1">Best Single Store</p>
                      <p className="text-2xl font-bold">{results.topStore}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="text-green-100 text-sm mb-1">Items Compared</p>
                      <p className="text-2xl font-bold">{results.itemCount}</p>
                    </div>
                    <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                      <p className="text-green-100 text-sm mb-1">ROI This Month</p>
                      <p className="text-2xl font-bold">{Math.round(totalSavingsThisMonth / 6.99)}x</p>
                    </div>
                  </div>
                </div>

                {/* Smart Shopping Plans */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Route className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        Smart Shopping Plans
                      </h2>
                      <p className="text-gray-600">Choose your strategy based on time vs. savings</p>
                    </div>
                  </div>

                  {/* Plan Selector */}
                  <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
                    <button
                      onClick={() => setSelectedPlan('1-stop')}
                      className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition ${
                        selectedPlan === '1-stop'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Target className={`w-5 h-5 ${selectedPlan === '1-stop' ? 'text-blue-600' : 'text-gray-600'}`} />
                        <h3 className={`font-bold ${selectedPlan === '1-stop' ? 'text-blue-900' : 'text-gray-900'}`}>
                          1-Stop Shop
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">Most convenient</p>
                      <p className="text-xs text-gray-500 mt-1">Save: ${plans.oneStop.totalSavings.toFixed(2)}</p>
                    </button>

                    <button
                      onClick={() => setSelectedPlan('2-stop')}
                      className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition ${
                        selectedPlan === '2-stop'
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Zap className={`w-5 h-5 ${selectedPlan === '2-stop' ? 'text-green-600' : 'text-gray-600'}`} />
                        <h3 className={`font-bold ${selectedPlan === '2-stop' ? 'text-green-900' : 'text-gray-900'}`}>
                          2-Stop Plan
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">Best balance</p>
                      <p className="text-xs text-green-700 font-semibold mt-1">Save: ${plans.twoStop.totalSavings.toFixed(2)} ⭐ Recommended</p>
                    </button>

                    <button
                      onClick={() => setSelectedPlan('3-stop')}
                      className={`flex-1 min-w-[200px] p-4 rounded-xl border-2 transition ${
                        selectedPlan === '3-stop'
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <Crown className={`w-5 h-5 ${selectedPlan === '3-stop' ? 'text-purple-600' : 'text-gray-600'}`} />
                        <h3 className={`font-bold ${selectedPlan === '3-stop' ? 'text-purple-900' : 'text-gray-900'}`}>
                          3-Stop Max Savings
                        </h3>
                      </div>
                      <p className="text-sm text-gray-600">Maximum savings</p>
                      <p className="text-xs text-gray-500 mt-1">Save: ${plans.threeStop.totalSavings.toFixed(2)}</p>
                    </button>
                  </div>

                  {/* Plan Details */}
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-6 mb-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {currentPlan.description}
                    </p>

                    <div className="space-y-4">
                      {currentPlan.stops.map((stop, idx) => (
                        <div key={idx} className="bg-white rounded-lg p-5 border-2 border-slate-200">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                {idx + 1}
                              </div>
                              <div>
                                <h4 className="font-bold text-lg text-gray-900">{stop.store}</h4>
                                <p className="text-sm text-gray-600">{stop.totalItems} items • Est. save ${stop.estimatedSavings.toFixed(2)}</p>
                              </div>
                            </div>
                            <MapPin className="w-5 h-5 text-gray-400" />
                          </div>
                          
                          <div className="flex flex-wrap gap-2">
                            {stop.items.map((item, itemIdx) => (
                              <span
                                key={itemIdx}
                                className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium capitalize"
                              >
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedPlan === '2-stop' && (
                      <div className="mt-4 p-4 bg-green-100 border-2 border-green-300 rounded-lg">
                        <p className="text-sm text-green-800 font-semibold flex items-center gap-2">
                          <Zap className="w-4 h-4" />
                          💡 Pro Tip: This plan gives you the best savings-to-effort ratio. You'll hit the biggest price differences without making your shopping trip too complicated.
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Detailed Price Breakdown */}
                <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Full Price Breakdown
                    </h2>
                    <button 
                      onClick={() => setShowAlertsModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition text-sm font-semibold"
                    >
                      <Bell className="w-4 h-4" />
                      Set Price Alerts
                    </button>
                  </div>

                  {results.items.map((item, idx) => (
                    item.found && (
                      <div key={idx} className="mb-6 last:mb-0 pb-6 last:pb-0 border-b last:border-0">
                        <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize flex items-center justify-between">
                          <span>{item.item}</span>
                          {item.best && item.best.savings > 0.50 && (
                            <span className="text-sm bg-amber-100 text-amber-700 px-3 py-1 rounded-full font-semibold">
                              Great Deal! 🔥
                            </span>
                          )}
                        </h3>
                        <div className="space-y-2">
                          {item.allPrices.map((product, pIdx) => {
                            const isBest = pIdx === 0;
                            return (
                              <div
                                key={pIdx}
                                className={`flex items-center justify-between p-4 rounded-lg transition ${
                                  isBest 
                                    ? 'bg-green-100 border-2 border-green-300' 
                                    : 'bg-gray-50 hover:bg-gray-100'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  {isBest && (
                                    <Crown className="w-5 h-5 text-amber-600" />
                                  )}
                                  <div>
                                    <p className="font-semibold text-gray-900">{product.store}</p>
                                    <p className="text-sm text-gray-600">{product.name}</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className={`text-xl font-bold ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
                                    ${product.price.toFixed(2)}
                                  </p>
                                  <p className="text-sm text-gray-600">per {product.unit}</p>
                                  {product.savings > 0 && !isBest && (
                                    <p className="text-xs text-red-600 mt-1">
                                      +${product.savings.toFixed(2)} vs best
                                    </p>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Save List Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900">Save Shopping List</h3>
              <button onClick={() => setShowSaveModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <input
              type="text"
              placeholder="List name (e.g., Weekly Groceries)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 mb-4"
            />
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition font-semibold"
              >
                Cancel
              </button>
              <button 
                onClick={() => setShowSaveModal(false)}
                className="flex-1 px-4 py-3 bg-amber-600 text-white rounded-xl hover:bg-amber-700 transition font-semibold"
              >
                Save List
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Price Alerts Modal */}
      {showAlertsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">Price Drop Alerts</h3>
              <button onClick={() => setShowAlertsModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-semibold text-gray-900">Chicken Breast</p>
                      <p className="text-sm text-gray-600">Alert when below $14.00/kg</p>
                    </div>
                  </div>
                  <button className="p-2 hover:bg-blue-100 rounded-lg">
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
                <p className="text-sm text-blue-700">✓ Active - Currently $14.97/kg at Maxi</p>
              </div>

              <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-amber-500 hover:bg-amber-50 transition flex items-center justify-center gap-2 text-gray-600 hover:text-amber-600">
                <Plus className="w-5 h-5" />
                Add New Alert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}