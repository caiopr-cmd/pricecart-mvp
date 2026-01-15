import Link from "next/link";
import { Button } from "@/components/Button";
import { Logo } from "@/components/Logo";

export default function LoginPage() {
  return (
    <main className="bg-cinematic min-h-[70vh]">
      <section className="mx-auto max-w-md px-4 py-14">
        <div className="flex justify-center"><Logo /></div>

        <div className="mt-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_12px_30px_rgba(2,6,23,0.10)]">
          <h1 className="text-2xl font-extrabold text-slate-900">Log in</h1>
          <p className="mt-2 text-sm text-slate-600">MVP placeholder. Wire this to your auth provider later.</p>

          <form className="mt-6 space-y-4">
            <Field label="Email" type="email" placeholder="you@example.ca" />
            <Field label="Password" type="password" placeholder="••••••••" />
            <Button href="/" variant="secondary" className="w-full">Continue</Button>
          </form>

          <p className="mt-4 text-sm text-slate-600">
            New here? <Link className="font-semibold text-slate-900 hover:underline" href="/auth/signup">Create an account</Link>
          </p>
        </div>
      </section>
    </main>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <div className="text-sm font-bold text-slate-700">{label}</div>
      <input
        {...props}
        className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[color:var(--pc-blue)]"
      />
    </label>
  );
}