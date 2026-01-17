"use client";

import React, { useState, useEffect } from 'react';
import { TrendingDown, ShoppingCart, AlertCircle, Check, Lock, Crown, ArrowRight, Zap } from 'lucide-react';

// Mock data - replace with real database calls
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
    { store: 'Super C', name: 'Whole Wheat 675g', price: 2.99, unit: 'loaf', savings: 2.00 },
    { store: 'Maxi', name: 'Whole Wheat 675g', price: 3.49, unit: 'loaf', savings: 1.50 },
    { store: 'Metro', name: 'Artisan Whole Grain', price: 4.99, unit: 'loaf', savings: 0 },
    { store: 'Provigo', name: 'Organic Whole Wheat', price: 5.49, unit: 'loaf', savings: -0.50 }
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
  ]
};

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

export default function ComparePage() {
  const [input, setInput] = useState('');
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Free tier tracking: COUNT ITEMS, NOT COMPARISONS
  const [itemsUsedThisWeek, setItemsUsedThisWeek] = useState(0);
  const [isPro, setIsPro] = useState(false);
  
  const FREE_ITEM_LIMIT = 5;
  const itemsRemaining = FREE_ITEM_LIMIT - itemsUsedThisWeek;
  
  // Load from localStorage on mount
  useEffect(() => {
    const savedItemsUsed = parseInt(localStorage.getItem('dev_itemsUsed') || '0');
    const savedProStatus = localStorage.getItem('dev_isPro') === 'true';
    setItemsUsedThisWeek(savedItemsUsed);
    setIsPro(savedProStatus);
  }, []);

  const handleCompare = () => {
    if (!input.trim()) return;

    const items = input.toLowerCase().split(',').map(i => i.trim()).filter(Boolean);
    
    // Check if user would exceed limit
    if (!isPro && (itemsUsedThisWeek + items.length) > FREE_ITEM_LIMIT) {
      // Don't run comparison, show error
      return;
    }

    setLoading(true);
    
    setTimeout(() => {
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
      
      // Increment items used count (not comparison count!)
      if (!isPro) {
        const newItemsUsed = itemsUsedThisWeek + items.length;
        setItemsUsedThisWeek(newItemsUsed);
        localStorage.setItem('dev_itemsUsed', String(newItemsUsed));
      }
      
      setLoading(false);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleCompare();
  };

  // Calculate how many items user is trying to compare
  const currentItemCount = input.split(',').map(i => i.trim()).filter(Boolean).length;
  const wouldExceedLimit = !isPro && (itemsUsedThisWeek + currentItemCount) > FREE_ITEM_LIMIT;
  const canCompare = input.trim() && !wouldExceedLimit;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-green-50">
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16">
        
        {/* Header with Free Tier Counter */}
        {!results && (
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6">
              <ShoppingCart className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Compare Grocery Prices
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Find the cheapest prices across Montreal stores
            </p>
            
            {/* Free Tier Badge */}
            {!isPro && (
              <div className="mt-6 inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border-2 border-blue-200 rounded-full">
                <Zap className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-semibold text-blue-900">
                  {itemsRemaining} free item{itemsRemaining !== 1 ? 's' : ''} remaining this week
                </span>
              </div>
            )}
          </div>
        )}

        {/* Main Input */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <label className="block text-lg font-semibold text-gray-900 mb-3">
            What are you shopping for?
          </label>
          <p className="text-sm text-gray-600 mb-4">
            Enter items separated by commas (e.g., chicken, eggs, milk)
          </p>
          
          <div className="space-y-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="chicken, eggs, milk, bread..."
              disabled={itemsUsedThisWeek >= FREE_ITEM_LIMIT && !isPro}
              className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-100 transition disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            
            {/* Item count warning */}
            {!isPro && currentItemCount > 0 && (
              <div className={`text-sm ${wouldExceedLimit ? 'text-red-600' : 'text-gray-600'}`}>
                {currentItemCount} item{currentItemCount !== 1 ? 's' : ''} to compare
                {wouldExceedLimit && (
                  <span className="font-semibold"> - This exceeds your {itemsRemaining} remaining item{itemsRemaining !== 1 ? 's' : ''}!</span>
                )}
              </div>
            )}
            
            {/* Exceeded limit state */}
            {wouldExceedLimit ? (
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 text-white">
                <div className="flex items-start gap-4">
                  <div className="bg-white/20 p-3 rounded-xl">
                    <Lock className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">
                      You only have {itemsRemaining} free item{itemsRemaining !== 1 ? 's' : ''} left this week
                    </h3>
                    <p className="text-blue-100 mb-4">
                      You&apos;re trying to compare {currentItemCount} items, but you only have {itemsRemaining} remaining. 
                      {itemsRemaining > 0 ? ' Remove some items or ' : ' '}Upgrade to PriceCart Pro for unlimited items.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                      <a 
                        href="/pricing"
                        className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition flex items-center justify-center gap-2"
                      >
                        <Crown className="w-5 h-5" />
                        Upgrade to Pro - $6.99/month
                        <ArrowRight className="w-4 h-4" />
                      </a>
                      {itemsRemaining === 0 && (
                        <button 
                          onClick={() => {
                            setItemsUsedThisWeek(0);
                            localStorage.setItem('dev_itemsUsed', '0');
                          }}
                          className="bg-white/10 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition border-2 border-white/30"
                        >
                          Wait until next week
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={handleCompare}
                disabled={!canCompare || loading}
                className="w-full py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition font-semibold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                    Finding Best Prices...
                  </>
                ) : (
                  <>
                    <TrendingDown className="w-6 h-6" />
                    Compare Prices
                    {!isPro && currentItemCount > 0 && (
                      <span className="ml-2 text-sm opacity-90">
                        ({itemsRemaining - currentItemCount} items left after)
                      </span>
                    )}
                  </>
                )}
              </button>
            )}
          </div>

          {/* Trust Signals */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-green-600">4</p>
                <p className="text-xs text-gray-600">Major Stores</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">150k+</p>
                <p className="text-xs text-gray-600">Products</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">Daily</p>
                <p className="text-xs text-gray-600">Updates</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-600">$50+</p>
                <p className="text-xs text-gray-600">Avg. Savings/mo</p>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <>
            {/* Big Savings Card */}
            <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-2xl shadow-2xl p-8 mb-8 text-white">
              <div className="text-center">
                <p className="text-green-100 text-lg mb-2">You could save</p>
                <p className="text-6xl md:text-7xl font-bold mb-4">
                  ${results.totalSavings}
                </p>
                <p className="text-xl text-green-50 mb-6">
                  on this shopping trip
                </p>
                
                {/* Pro Upsell in Results */}
                {!isPro && itemsRemaining <= 1 && (
                  <div className="bg-white/10 backdrop-blur border-2 border-white/30 rounded-xl p-4 mt-6">
                    <p className="text-sm text-green-50 mb-3">
                      💡 You&apos;re saving ${results.totalSavings} with just {results.itemCount} items. 
                      {itemsRemaining === 0 
                        ? " You've used all 5 free items this week!"
                        : " You have only 1 item left this week!"
                      }
                    </p>
                    <a 
                      href="/pricing"
                      className="bg-white text-green-600 px-5 py-2 rounded-lg font-semibold hover:bg-green-50 transition text-sm inline-block"
                    >
                      Get Unlimited Items - $6.99/month
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-8 grid md:grid-cols-2 gap-4">
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <p className="text-green-100 text-sm mb-1">Best Store Overall</p>
                  <p className="text-2xl font-bold">{results.topStore}</p>
                </div>
                <div className="bg-white/10 backdrop-blur rounded-xl p-4">
                  <p className="text-green-100 text-sm mb-1">Items Compared</p>
                  <p className="text-2xl font-bold">{results.itemCount}</p>
                </div>
              </div>
            </div>

            {/* Simple Recommendation List */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Check className="w-6 h-6 text-green-600" />
                Where to Shop
              </h2>

              <div className="space-y-4">
                {results.items.map((item, idx) => (
                  item.found ? (
                    <div key={idx} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-2 border-green-200">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 capitalize text-lg">
                          {item.item}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          {item.best?.name}
                        </p>
                      </div>
                      <div className="text-right ml-4">
                        <p className="text-xs text-gray-600 mb-1">Best at</p>
                        <p className="text-xl font-bold text-green-700">
                          {item.best?.store}
                        </p>
                        <p className="text-lg font-semibold text-gray-900">
                          ${item.best?.price.toFixed(2)}
                          <span className="text-sm text-gray-600">/{item.best?.unit}</span>
                        </p>
                        {item.best && item.best.savings > 0 && (
                          <p className="text-xs text-green-600 font-medium mt-1">
                            Save ${item.best.savings.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border-2 border-gray-200">
                      <AlertCircle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                      <div>
                        <p className="font-semibold text-gray-900 capitalize">
                          {item.item}
                        </p>
                        <p className="text-sm text-gray-600">
                          Not found. Try &quot;chicken breast&quot; or &quot;2% milk&quot;
                        </p>
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>

            {/* Detailed Comparison */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Full Price Comparison
              </h2>

              {results.items.map((item, idx) => (
                item.found && (
                  <div key={idx} className="mb-8 last:mb-0">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize">
                      {item.item}
                    </h3>
                    <div className="space-y-2">
                      {item.allPrices.map((product, pIdx) => {
                        const isBest = pIdx === 0;
                        return (
                          <div
                            key={pIdx}
                            className={`flex items-center justify-between p-3 rounded-lg ${
                              isBest 
                                ? 'bg-green-100 border-2 border-green-300' 
                                : 'bg-gray-50'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              {isBest && (
                                <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full font-bold">
                                  BEST
                                </span>
                              )}
                              <div>
                                <p className="font-semibold text-gray-900">
                                  {product.store}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {product.name}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`text-xl font-bold ${isBest ? 'text-green-700' : 'text-gray-900'}`}>
                                ${product.price.toFixed(2)}
                              </p>
                              <p className="text-sm text-gray-600">
                                per {product.unit}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )
              ))}
            </div>

            {/* Pro Conversion CTA */}
            {!isPro && (
              <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 rounded-2xl shadow-2xl p-8 text-white mb-8">
                <div className="text-center max-w-2xl mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-6">
                    <Crown className="w-8 h-8" />
                  </div>
                  <h2 className="text-3xl font-bold mb-4">
                    Ready to Save More Every Week?
                  </h2>
                  <p className="text-xl text-blue-100 mb-6">
                    Join PriceCart Pro and unlock unlimited items, price drop alerts, and shopping list optimization.
                  </p>
                  
                  <div className="bg-white/10 backdrop-blur border-2 border-white/30 rounded-xl p-6 mb-6">
                    <div className="grid md:grid-cols-3 gap-4 text-center mb-6">
                      <div>
                        <p className="text-3xl font-bold mb-1">Unlimited</p>
                        <p className="text-sm text-blue-100">Items</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold mb-1">$50-100</p>
                        <p className="text-sm text-blue-100">Avg. Monthly Savings</p>
                      </div>
                      <div>
                        <p className="text-3xl font-bold mb-1">$6.99</p>
                        <p className="text-sm text-blue-100">Per Month</p>
                      </div>
                    </div>
                    <p className="text-sm text-blue-200">
                      That&apos;s a 10x return on investment every single month
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <a 
                      href="/pricing"
                      className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-blue-50 transition shadow-xl flex items-center justify-center gap-2"
                    >
                      Start Free Trial
                      <ArrowRight className="w-5 h-5" />
                    </a>
                    <a 
                      href="/pricing"
                      className="bg-white/10 border-2 border-white/30 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-white/20 transition"
                    >
                      See All Features
                    </a>
                  </div>
                  
                  <p className="text-sm text-blue-200 mt-4">
                    14-day free trial • Cancel anytime • No credit card required
                  </p>
                </div>
              </div>
            )}

            {/* New Search */}
            <div className="text-center">
              <button
                onClick={() => {
                  setResults(null);
                  setInput('');
                }}
                className="text-green-600 hover:text-green-700 font-semibold text-lg underline"
              >
                ← Compare Different Items
              </button>
              
              {!isPro && itemsRemaining > 0 && (
                <p className="text-sm text-gray-600 mt-2">
                  {itemsRemaining} item{itemsRemaining !== 1 ? 's' : ''} remaining this week
                </p>
              )}
            </div>
          </>
        )}

        {/* Trust Footer */}
        <div className="mt-12 text-center text-sm text-gray-600">
          <p className="mb-2">
            Real prices updated daily from Maxi, Metro, Provigo, and Super C
          </p>
          <p className="text-xs text-gray-500">
            Your data is never sold. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}