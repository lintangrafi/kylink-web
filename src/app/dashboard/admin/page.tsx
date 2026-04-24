import { db } from "@/db";
import { links, analytics, user } from "@/db/schema";
import { count, sql } from "drizzle-orm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Users, Link as LinkIcon, MousePointer2, TrendingUp, ShieldAlert } from "lucide-react";

export default async function AdminLandingPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/dashboard");
  }

  // Fetch Global Stats
  const [totalLinks] = await db.select({ count: count() }).from(links);
  const [totalClicks] = await db.select({ count: count() }).from(analytics);
  const [totalUsers] = await db.select({ count: count() }).from(user);

  const recentLinks = await db.query.links.findMany({
    orderBy: (links, { desc }) => [desc(links.createdAt)],
    limit: 5,
    with: {
        user: true
    }
  });

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black tracking-tight text-slate-900">Admin Overview</h1>
         <p className="text-slate-500 font-medium tracking-wide flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-orange-500" />
            System-wide statistics and management
         </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white overflow-hidden relative group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
             <LinkIcon size={120} />
          </div>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-black">{totalLinks.count}</div>
             <p className="text-xs mt-2 opacity-70">Shortened by all users</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-gradient-to-br from-orange-500 to-orange-600 text-white overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
             <MousePointer2 size={120} />
          </div>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Global Traffic</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-black">{totalClicks.count}</div>
             <p className="text-xs mt-2 opacity-70">Redirects processed</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-2xl bg-gradient-to-br from-indigo-600 to-indigo-700 text-white overflow-hidden relative group">
           <div className="absolute top-0 right-0 p-4 opacity-10 transform translate-x-4 -translate-y-4 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500">
             <Users size={120} />
          </div>
          <CardHeader className="pb-2">
             <CardTitle className="text-sm font-bold uppercase tracking-widest opacity-80">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-4xl font-black">{totalUsers.count}</div>
             <p className="text-xs mt-2 opacity-70">Registered accounts</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <Card className="border-slate-100 shadow-xl rounded-2xl overflow-hidden">
          <CardHeader className="border-b bg-slate-50/50">
             <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Recent Link Activity
             </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
             <div className="divide-y divide-slate-100">
                {recentLinks.map((link) => (
                    <div key={link.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                        <div className="min-w-0">
                            <p className="font-bold text-slate-800 text-sm truncate">/{link.shortCode}</p>
                            <p className="text-xs text-slate-400 truncate max-w-[200px]">{link.originalUrl}</p>
                        </div>
                        <div className="text-right">
                             <p className="text-[10px] font-black text-blue-600 uppercase">{(link as any).user?.name || 'Guest'}</p>
                             <p className="text-[10px] text-slate-400">{new Date(link.createdAt!).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>

        {/* Admin Quick Actions */}
        <div className="space-y-6">
            <h3 className="font-black text-slate-800 uppercase tracking-widest text-sm flex items-center gap-2">
                <span className="h-1 w-4 bg-blue-600 rounded"></span>
                Quick Administration
            </h3>
            <div className="grid grid-cols-1 gap-4">
                <a href="/dashboard/admin/ads" className="p-6 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                            📢
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">Manage Global Ads</p>
                            <p className="text-xs text-slate-500 font-medium">Update banner, links, and ad copies.</p>
                        </div>
                    </div>
                </a>
                <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-200 rounded-xl flex items-center justify-center text-slate-400">
                            👤
                        </div>
                        <div>
                            <p className="font-bold text-slate-800">User Management</p>
                            <p className="text-xs text-slate-500 font-medium">Coming soon: Ban, edit, or delete users.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
