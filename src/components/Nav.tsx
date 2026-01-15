import Link from "next/link";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/Button";

const navLinks = [
  { href: "/compare", label: "Compare" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/deals", label: "Deals" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/70 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="flex items-center">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          {navLinks.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-slate-900">
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/auth/login" className="hidden text-sm font-semibold text-slate-700 hover:text-slate-900 sm:inline">
            Log in
          </Link>
          <Button href="/auth/signup" variant="primary">
            Start free
          </Button>
        </div>
      </div>
    </header>
  );
}