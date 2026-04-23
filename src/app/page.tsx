import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center">
      <div className="max-w-3xl space-y-6">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 leading-tight">
          Simplify your links with <span className="text-blue-600">KyLink</span>
        </h1>
        <p className="text-xl text-slate-600 font-light max-w-2xl mx-auto">
          The minimal, flat-designed, and lightning-fast advanced URL shortener for modern teams and professionals.
        </p>
        <div className="pt-8 flex justify-center gap-4">
          <Link href="/login">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white shadow-none rounded-md px-8 text-lg h-14">
              Start Shortening — It's Free
            </Button>
          </Link>
          <Link href="/dashboard">
            <Button size="lg" variant="outline" className="border-slate-300 text-slate-700 shadow-none rounded-md px-8 text-lg h-14 hover:bg-slate-100">
              Open Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
