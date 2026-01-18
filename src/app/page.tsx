"use client";

import { useState, useEffect } from 'react';
import { TrendingDown, Sparkles, Check, ShoppingCart, ArrowRight, Zap, Star } from 'lucide-react';

const rows = [
  { item: "Chicken breast", best: "Maxi", bestPrice: "$13.99/kg", next: "Metro", nextPrice: "$16.50/kg", save: "$2.51/kg" },
  { item: "Eggs (12)", best: "Super C", bestPrice: "$4.49", next: "Metro", nextPrice: "$5.29", save: "$0.80" },
  { item: "Greek yogurt", best: "Metro", bestPrice: "$3.99", next: "Provigo", nextPrice: "$4.49", save: "$0.50" },
];

const rotatingPhrases = [
  { text: "groceries", color: "from-green-600 via-emerald-600 to-teal-600" },
  { text: "your weekly shop", color: "from-blue-600 via-cyan-600 to-teal-600" },
  { text: "essentials", color: "from-purple-600 via-violet-600 to-indigo-600" },
  { text: "food costs", color: "from-orange-600 via-amber-600 to-yellow-600" },
];

export default function HomePage() {
  const [savingsCounter, setSavingsCounter] = useState(0);
  const [currentPhraseIndex, setCurrentPhraseIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const targetSavings = 87;

  // Savings counter animation
  useEffect(() => {
    const interval = setInterval(() => {
      setSavingsCounter((prev) => {
        if (prev >= targetSavings) return targetSavings;
        return prev + 3;
      });
    }, 50);
    return () => clearInterval(interval);
  }, []);

  // Rotating text animation
  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentPhraseIndex((prev) => (prev + 1) % rotatingPhrases.length);
        setIsAnimating(false);
      }, 500);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const currentPhrase = rotatingPhrases[currentPhraseIndex];

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-green-50/30 to-blue-50/30">
      {/* Animated background elements */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 h-96 w-96 rounded-full bg-gradient-to-br from-green-400/20 to-emerald-400/20 blur-3xl animate-pulse" />
        <div className="absolute top-1/4 -right-40 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-blue-400/15 to-cyan-400/15 blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-amber-400/10 to-orange-400/10 blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(15 23 42) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* HERO SECTION */}
      <section className="relative px-4 pt-20 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-12 items-center">
            
            {/* Left: Content */}
            <div className="relative z-10">
              {/* Floating badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 backdrop-blur-sm mb-6 opacity-0 animate-fade-in" style={{ animationDelay: '0.1s', animationFillMode: 'forwards' }}>
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-semibold text-green-900">Trusted by thousands of Montreal families</span>
              </div>

              {/* Main headline with rotating text */}
              <h1 className="text-5xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6">
                <span className="block opacity-0 animate-fade-in-up" style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}>
                  Stop overpaying for
                </span>
                <span className="block mt-2 h-[1.2em] relative overflow-hidden">
                  <span 
                    className={`absolute inset-0 bg-gradient-to-r ${currentPhrase.color} bg-clip-text text-transparent transition-all duration-500 ${
                      isAnimating ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                    }`}
                  >
                    {currentPhrase.text}
                  </span>
                </span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 max-w-xl leading-relaxed opacity-0 animate-fade-in-up" style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}>
                Compare prices across <span className="font-bold text-slate-900">Maxi, Metro, Provigo, and Super C</span> in seconds. 
                Save money without changing what you eat.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-12 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}>
                <a
                  href="/compare"
                  className="group relative px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-2xl font-bold text-lg shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Compare My List
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </a>
                
                <a
                  href="/how-it-works"
                  className="px-8 py-4 bg-white/80 backdrop-blur-sm text-slate-900 rounded-2xl font-bold text-lg border-2 border-slate-200 hover:border-slate-300 transition-all hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  See How It Works
                </a>
              </div>

              {/* Trust indicators */}
              <div className="flex flex-wrap gap-8 opacity-0 animate-fade-in-up" style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">No credit card</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">5 free items/week</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-5 h-5 text-green-600" />
                  <span className="text-sm font-semibold text-slate-700">Cancel anytime</span>
                </div>
              </div>
            </div>

            {/* Right: Interactive demo */}
            <div className="relative opacity-0 animate-fade-in-up" style={{ animationDelay: '0.5s', animationFillMode: 'forwards' }}>
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/20 via-blue-500/20 to-purple-500/20 blur-3xl rounded-3xl" />
              
              <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
                <div className="px-6 py-5 border-b border-slate-200/50 bg-gradient-to-r from-slate-50 to-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <Zap className="w-4 h-4 text-amber-500" />
                        Live Example
                      </h3>
                      <p className="text-xs text-slate-600 mt-0.5">Real comparison results</p>
                    </div>
                    <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                      Updated daily
                    </span>
                  </div>
                </div>

                <div className="px-6 py-5 bg-gradient-to-br from-slate-50 to-white">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="chicken, eggs, milk, bread..."
                      disabled
                      className="w-full px-4 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-medium text-slate-400 placeholder:text-slate-400"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      <span className="px-2 py-1 bg-slate-100 rounded text-xs font-bold text-slate-600">4 items</span>
                    </div>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50 border-y border-slate-200/50">
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Item</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">Best Price</th>
                        <th className="px-6 py-3 text-left text-xs font-bold text-slate-700">You Save</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200/50">
                      {rows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{row.item}</div>
                            <div className="text-xs text-slate-500 mt-0.5">at {row.best}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-bold text-lg text-slate-900">{row.bestPrice}</div>
                            <div className="text-xs text-slate-500">{row.next}: {row.nextPrice}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-bold">
                              <TrendingDown className="w-3 h-3" />
                              {row.save}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="px-6 py-4 bg-gradient-to-br from-green-50 to-emerald-50 border-t border-green-200/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-700">Total potential savings:</span>
                    <span className="text-2xl font-black text-green-700">$3.81</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="relative px-4 pb-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              value="150k+" 
              label="Products tracked"
              icon={<ShoppingCart className="w-6 h-6" />}
            />
            <StatCard 
              value={`$${savingsCounter}`}
              label="Avg. monthly savings"
              icon={<TrendingDown className="w-6 h-6" />}
              highlight
            />
            <StatCard 
              value="4" 
              label="Major stores compared"
              icon={<Check className="w-6 h-6" />}
            />
            <StatCard 
              value="30s" 
              label="To check your list"
              icon={<Zap className="w-6 h-6" />}
            />
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="relative px-4 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-black text-slate-900 mb-4">
              Why Montreal families love PriceCart
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Simple tools that actually save you money. No gimmicks, just savings.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <ValueCard
              title="Compare 4 Major Stores"
              description="See prices from Maxi, Metro, Provigo, and Super C side-by-side in real-time."
              icon="🏪"
            />
            <ValueCard
              title="Unit Price Intelligence"
              description="Compare $/kg, $/L automatically so you're never fooled by package sizes."
              icon="⚖️"
            />
            <ValueCard
              title="No Sponsored Rankings"
              description="We show the cheapest price, period. No store pays for better placement."
              icon="🎯"
            />
            <ValueCard
              title="Smart Shopping Lists"
              description="Save your weekly lists and reuse them. Pro users get unlimited saved lists."
              icon="📝"
            />
            <ValueCard
              title="Price Drop Alerts"
              description="Get notified when your favorite items go on sale. Never miss a deal again."
              icon="🔔"
              isPro
            />
            <ValueCard
              title="Weekly Reports"
              description="See exactly how much you saved this week, month, and year."
              icon="📊"
              isPro
            />
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF */}
      <section className="relative px-4 pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 p-12">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 rounded-full mb-4">
                <Star className="w-4 h-4 text-amber-600 fill-amber-600" />
                <span className="text-sm font-bold text-amber-900">4.9/5 average rating</span>
              </div>
              <h2 className="text-3xl font-black text-slate-900">
                What Montreal shoppers are saying
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Testimonial
                quote="I saved $47 on my first shopping trip. This tool pays for itself immediately!"
                author="Sarah M."
                role="Mom of 2, Verdun"
              />
              <Testimonial
                quote="Finally, someone built this! I've been manually checking flyers for years."
                author="Janet L."
                role="Retiree, NDG"
              />
              <Testimonial
                quote="As a student on a budget, every dollar counts. PriceCart is essential."
                author="Marc D."
                role="McGill Student"
              />
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative px-4 pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-500 rounded-3xl blur-xl opacity-20" />
            <div className="relative bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-12 text-center">
              <h2 className="text-4xl font-black text-white mb-4">
                Ready to save money every week?
              </h2>
              <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                Join thousands of Montreal families who are shopping smarter with PriceCart.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/compare"
                  className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-bold text-lg hover:bg-slate-100 transition-all flex items-center justify-center gap-2"
                >
                  Start Comparing Free
                  <ArrowRight className="w-5 h-5" />
                </a>
                <a
                  href="/pricing"
                  className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white rounded-2xl font-bold text-lg border-2 border-white/20 hover:bg-white/20 transition-all flex items-center justify-center gap-2"
                >
                  View Pricing
                </a>
              </div>

              <p className="text-sm text-slate-400 mt-6">
                5 free item comparisons per week • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
      `}</style>
    </main>
  );
}

function StatCard({ value, label, icon, highlight = false }: { value: string; label: string; icon: React.ReactNode; highlight?: boolean }) {
  return (
    <div className={`relative group ${highlight ? 'animate-pulse-slow' : ''}`}>
      <div className={`absolute inset-0 ${highlight ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20' : 'bg-gradient-to-br from-slate-200/50 to-slate-100/50'} rounded-2xl blur-xl transition-all group-hover:blur-2xl`} />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl">
        <div className={`${highlight ? 'text-green-600' : 'text-slate-600'} mb-3`}>
          {icon}
        </div>
        <div className={`text-3xl font-black ${highlight ? 'text-green-600' : 'text-slate-900'} mb-1`}>
          {value}
        </div>
        <div className="text-sm font-medium text-slate-600">
          {label}
        </div>
      </div>
    </div>
  );
}

function ValueCard({ title, description, icon, isPro = false }: { title: string; description: string; icon: string; isPro?: boolean }) {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-100/50 rounded-2xl blur-xl transition-all group-hover:blur-2xl" />
      <div className="relative bg-white/90 backdrop-blur-xl rounded-2xl p-6 border border-slate-200/50 transition-all hover:-translate-y-1 hover:shadow-xl h-full">
        <div className="flex items-start justify-between mb-4">
          <span className="text-4xl">{icon}</span>
          {isPro && (
            <span className="px-2 py-1 bg-gradient-to-r from-amber-400 to-amber-500 text-white rounded-full text-xs font-bold">
              PRO
            </span>
          )}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
      </div>
    </div>
  );
}

function Testimonial({ quote, author, role }: { quote: string; author: string; role: string }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl" />
      <div className="relative bg-white rounded-2xl p-6 border border-slate-200/50">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
          ))}
        </div>
        <p className="text-slate-700 mb-4 leading-relaxed">&quot;{quote}&quot;</p>
        <div>
          <div className="font-bold text-slate-900">{author}</div>
          <div className="text-sm text-slate-600">{role}</div>
        </div>
      </div>
    </div>
  );
}