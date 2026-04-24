import { db } from "@/db";
import { analytics, links } from "@/db/schema";
import { eq, count, sql } from "drizzle-orm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { BarChart3, Globe, MousePointer2, Smartphone } from "lucide-react";

export default async function LinkAnalyticsPage({ params }: { params: Promise<{ code: string }> }) {
  const code = (await params).code;

  const link = await db.query.links.findFirst({
    where: eq(links.shortCode, code),
  });

  if (!link) {
    notFound();
  }

  // Aggregate stats
  const totalClicks = await db
    .select({ count: count() })
    .from(analytics)
    .where(eq(analytics.linkId, link.id));

  const referrers = await db
    .select({ 
      name: analytics.referrer, 
      count: count() 
    })
    .from(analytics)
    .where(eq(analytics.linkId, link.id))
    .groupBy(analytics.referrer)
    .orderBy(sql`count DESC`)
    .limit(5);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
         <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-mono">/{code} Analytics</h1>
         <p className="text-slate-500">Insights and performance data for this link.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-none border-slate-200">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
             <CardTitle className="text-sm font-medium">Total Clicks</CardTitle>
             <MousePointer2 className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{totalClicks[0].count}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="shadow-none border-slate-200">
           <CardHeader>
              <CardTitle className="flex items-center gap-2">
                 <Globe className="w-5 h-5 text-slate-400" />
                 Top Referrers
              </CardTitle>
           </CardHeader>
           <CardContent>
              <div className="space-y-4">
                 {referrers.map((ref, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600 truncate max-w-[200px]">
                        {ref.name === 'unknown' ? 'Direct / None' : ref.name}
                      </span>
                      <span className="font-bold text-sm bg-slate-100 px-2 py-1 rounded">
                         {ref.count} clicks
                      </span>
                   </div>
                 ))}
                 {referrers.length === 0 && (
                   <p className="text-sm text-slate-400 italic">No data yet.</p>
                 )}
              </div>
           </CardContent>
         </Card>

         <Card className="shadow-none border-slate-200 bg-blue-600 text-white">
            <CardHeader>
               <CardTitle className="text-white">Marketing Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
               <p className="text-sm opacity-90 leading-relaxed">
                  To increase your conversion rate, share this link on platforms where your main audience hangs out.
               </p>
               <div className="pt-4 border-t border-white/20">
                  <p className="text-xs font-bold uppercase tracking-widest opacity-70">Current Strategy</p>
                  <p className="text-lg font-bold">Interstitial Ads Enabled</p>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
