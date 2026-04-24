import { ReactNode } from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers()
  });

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="font-bold text-xl text-blue-600">KyLink Dashboard</div>
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link href="/dashboard" className="hover:text-blue-600 font-medium">My Links</Link>
            {(session.user as any).role === 'admin' && (
              <Link href="/dashboard/admin" className="text-orange-600 hover:text-orange-700 font-bold bg-orange-50 px-3 py-1.5 rounded-lg border border-orange-100 flex items-center gap-2">
                <ShieldAlert className="w-4 h-4" />
                Admin Panel
              </Link>
            )}
            <div className="flex items-center gap-4 border-l pl-6">
              <span>{session.user.name}</span>
              <LogoutButton />
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}
