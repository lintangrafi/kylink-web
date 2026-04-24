import { db } from "@/db";
import { links, analytics, siteSettings } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { InterstitialAd } from "@/components/interstitial-ad";
import { headers } from "next/headers";

const isVideo = (url: string) => {
    return url?.match(/\.(mp4|webm|ogg|mov)$|video/i);
};

export default async function RedirectPage({ params }: { params: { code: string } }) {
  const code = (await params).code;

  const link = await db.query.links.findFirst({
    where: eq(links.shortCode, code),
  });

  if (!link) {
    notFound();
  }

  // Record analytics before redirect
  const headerList = await headers();
  const referrer = headerList.get("referer") || "Direct";
  const userAgent = headerList.get("user-agent") || "Unknown";

  await db.insert(analytics).values({
    linkId: link.id,
    referrer,
    userAgent,
    ipAddress: headerList.get("x-forwarded-for") || "unknown",
  });

  // If Ads are disabled for this link, redirect immediately
  if (!link.isAdEnabled) {
    redirect(link.originalUrl);
  }

  const ads = await db.query.siteSettings.findFirst();

  return (
    <main className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-blue-100 relative overflow-x-hidden">
      
      {/* Side Ads - Hidden on Mobile */}
      <div className="hidden xl:flex fixed left-0 top-0 bottom-0 w-[240px] bg-white border-r border-slate-100 flex-col items-center justify-center p-4 z-10">
          <p className="text-[10px] font-black text-slate-300 uppercase [writing-mode:vertical-lr] mb-4 transform -rotate-180 tracking-[0.3em]">Sponsor Content</p>
          {ads?.adSideLeftUrl ? (
            <a href={ads.adSideLeftTarget || "#"} target="_blank" rel="noopener noreferrer" className="w-full h-full max-h-[700px] overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-black">
                {isVideo(ads.adSideLeftUrl) ? (
                    <video src={ads.adSideLeftUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                    <img src={ads.adSideLeftUrl} alt="Ad" className="w-full h-full object-cover" />
                )}
            </a>
          ) : (
             <div className="w-full h-full max-h-[700px] bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <span className="text-slate-300 font-bold text-sm">SIDE AD</span>
             </div>
          )}
      </div>

      <div className="hidden xl:flex fixed right-0 top-0 bottom-0 w-[240px] bg-white border-l border-slate-100 flex-col items-center justify-center p-4 z-10">
          <p className="text-[10px] font-black text-slate-300 uppercase [writing-mode:vertical-lr] mb-4 tracking-[0.3em]">Sponsor Content</p>
          {ads?.adSideRightUrl ? (
            <a href={ads.adSideRightTarget || "#"} target="_blank" rel="noopener noreferrer" className="w-full h-full max-h-[700px] overflow-hidden rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg transition-all bg-black">
                {isVideo(ads.adSideRightUrl) ? (
                    <video src={ads.adSideRightUrl} autoPlay muted loop playsInline className="w-full h-full object-cover" />
                ) : (
                    <img src={ads.adSideRightUrl} alt="Ad" className="w-full h-full object-cover" />
                )}
            </a>
          ) : (
             <div className="w-full h-full max-h-[700px] bg-slate-50 rounded-2xl flex items-center justify-center border-2 border-dashed border-slate-200">
                <span className="text-slate-300 font-bold text-sm">SIDE AD</span>
             </div>
          )}
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col items-center min-h-screen relative xl:pr-[240px] xl:pl-[240px]">
        {/* Header Ad Space (Top) */}
        <div className="w-full max-w-4xl mb-8">
            <InterstitialAd 
                targetUrl={link.originalUrl} 
                adBanner={ads?.adBannerUrl || "/placeholder-ad.png"}
                adTarget={ads?.adTargetUrl || "#"}
                headline={ads?.adHeadline || "Sponsor Advertisement"}
            />
        </div>

        {/* Bottom Banner Grid */}
        <div className="w-full max-w-5xl mt-12">
            <div className="flex items-center gap-4 mb-8">
                <div className="h-[2px] flex-1 bg-gradient-to-r from-transparent to-slate-200"></div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-[0.3em]">Trending Sponsors</p>
                <div className="h-[2px] flex-1 bg-gradient-to-l from-transparent to-slate-200"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => {
                    const bannerUrl = (ads as any)?.[`adBottom${i}Url`];
                    const targetUrl = (ads as any)?.[`adBottom${i}Target`];

                    return (
                        <div key={i} className="group flex flex-col">
                            {bannerUrl ? (
                                <a href={targetUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full aspect-[4/3] rounded-3xl overflow-hidden border-4 border-white shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative bg-black">
                                    {isVideo(bannerUrl) ? (
                                        <video src={bannerUrl} autoPlay muted loop playsInline className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    ) : (
                                        <img src={bannerUrl} alt={`Sponsor ${i}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                                        <p className="text-white font-black text-sm uppercase tracking-widest">Explore Now ↗</p>
                                    </div>
                                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-[8px] font-black text-white px-2 py-1 rounded tracking-[0.2em]">
                                        {isVideo(bannerUrl) ? 'VIDEO AD' : 'AD'}
                                    </div>
                                </a>
                            ) : (
                                <div className="w-full aspect-[4/3] bg-slate-50 rounded-3xl border-4 border-dashed border-slate-200 flex items-center justify-center">
                                    <span className="text-slate-300 font-bold text-xs tracking-widest uppercase">Placeholder {i}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Footer info */}
        <footer className="mt-auto pt-20 pb-10 text-center">
             <div className="w-12 h-1 bg-blue-600 mx-auto mb-6 rounded-full opacity-20"></div>
             <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mx-auto leading-relaxed">
                You are securely being routed to your destination. 
                <br/>
                Powered by KyLink Secure Redirect.
             </p>
        </footer>
      </div>
    </main>
  );
}
