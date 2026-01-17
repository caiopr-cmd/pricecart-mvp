"use client";

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingCart, Crown, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const navLinks = [
  { href: "/compare", label: "Compare" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/deals", label: "Deals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export default function Navigation() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // DEV MODE: Mock auth state (stored in localStorage for testing)
  const [isPro, setIsPro] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load mock auth state from localStorage on mount
  useEffect(() => {
    const savedProStatus = localStorage.getItem('dev_isPro') === 'true';
    const savedLoginStatus = localStorage.getItem('dev_isLoggedIn') === 'true';
    setIsPro(savedProStatus);
    setIsLoggedIn(savedLoginStatus);
  }, []);

  // Toggle Pro status (for testing)
  const toggleProStatus = () => {
    const newProStatus = !isPro;
    setIsPro(newProStatus);
    localStorage.setItem('dev_isPro', String(newProStatus));
    if (newProStatus) {
      setIsLoggedIn(true);
      localStorage.setItem('dev_isLoggedIn', 'true');
    }
  };

  // Toggle Login status (for testing)
  const toggleLoginStatus = () => {
    const newLoginStatus = !isLoggedIn;
    setIsLoggedIn(newLoginStatus);
    localStorage.setItem('dev_isLoggedIn', String(newLoginStatus));
    if (!newLoginStatus) {
      setIsPro(false);
      localStorage.setItem('dev_isPro', 'false');
    }
  };

  return (
    <div>
      {/* DEV MODE BANNER - Remove this when going to production */}
      <div className="bg-yellow-400 text-yellow-900 px-4 py-2 text-center text-sm font-semibold border-b border-yellow-500">
        🧪 DEV MODE - Testing Auth States
        <button 
          onClick={toggleLoginStatus}
          className="ml-4 px-3 py-1 bg-yellow-900 text-yellow-100 rounded-md hover:bg-yellow-800 transition text-xs"
        >
          {isLoggedIn ? '✓ Logged In' : '✗ Logged Out'}
        </button>
        <button 
          onClick={toggleProStatus}
          className="ml-2 px-3 py-1 bg-yellow-900 text-yellow-100 rounded-md hover:bg-yellow-800 transition text-xs"
        >
          {isPro ? '👑 PRO' : '⚡ FREE'}
        </button>
      </div>

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          
          {/* Logo */}
<Link href="/" className="flex items-center gap-2 hover:opacity-80 transition">
  <Image 
    src="/PriceCart Logo 1.svg" 
    alt="PriceCart Logo" 
    width={140} 
    height={40}
    className="h-10 w-auto"
    priority
  />
  {isPro && (
    <span className="bg-gradient-to-r from-amber-400 to-amber-600 text-white px-2 py-0.5 rounded text-xs font-bold">
      PRO
    </span>
  )}
</Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
            {/* Show Pro Dashboard for Pro users */}
            {isPro && (
              <Link 
                href="/compare/pro"
                className={`flex items-center gap-1.5 transition ${
                  pathname === '/compare/pro' 
                    ? 'text-amber-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                <Crown className="w-4 h-4" />
                Pro Dashboard
              </Link>
            )}
            
            {/* Regular nav links */}
            {navLinks.map((link) => (
              <Link 
                key={link.href} 
                href={link.href}
                className={`transition ${
                  pathname === link.href 
                    ? 'text-green-600' 
                    : 'hover:text-slate-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                <Link 
                  href="/auth/login" 
                  className="text-sm font-semibold text-slate-700 hover:text-slate-900 px-3 py-2"
                >
                  Log in
                </Link>
                <Link
                  href="/auth/signup"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition shadow-sm"
                >
                  Start free
                </Link>
              </>
            ) : (
              <>
                {!isPro && (
                  <Link 
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-700 transition shadow-sm"
                  >
                    <Crown className="w-4 h-4" />
                    Upgrade to Pro
                  </Link>
                )}
                <div className="w-8 h-8 bg-gradient-to-br from-slate-200 to-slate-300 rounded-full flex items-center justify-center text-slate-700 font-semibold text-sm cursor-pointer hover:opacity-80">
                  T
                </div>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-slate-100 rounded-lg transition"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="flex flex-col px-4 py-3 gap-2">
              {/* Pro Dashboard for mobile */}
              {isPro && (
                <Link 
                  href="/compare/pro"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition flex items-center gap-2 ${
                    pathname === '/compare/pro' 
                      ? 'bg-amber-100 text-amber-600' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Crown className="w-4 h-4" />
                  Pro Dashboard
                </Link>
              )}

              {/* Regular nav links */}
              {navLinks.map((link) => (
                <Link 
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg font-semibold text-sm transition ${
                    pathname === link.href 
                      ? 'bg-green-100 text-green-600' 
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </Link>
              ))}

              {/* Mobile auth buttons */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-2">
                {!isLoggedIn ? (
                  <>
                    <Link 
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-center rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-sm transition"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setMobileMenuOpen(false)}
                      className="px-3 py-2 text-center text-sm font-semibold text-white bg-gradient-to-r from-green-500 to-green-600 rounded-lg hover:from-green-600 hover:to-green-700 transition"
                    >
                      Start free
                    </Link>
                  </>
                ) : (
                  <>
                    {!isPro && (
                      <Link 
                        href="/pricing"
                        onClick={() => setMobileMenuOpen(false)}
                        className="flex items-center justify-center gap-1.5 px-3 py-2 text-sm font-semibold text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-600 hover:to-amber-700 transition"
                      >
                        <Crown className="w-4 h-4" />
                        Upgrade to Pro
                      </Link>
                    )}
                    <button className="px-3 py-2 text-left rounded-lg text-slate-700 hover:bg-slate-100 font-semibold text-sm transition">
                      My Account
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}