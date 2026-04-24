import { db } from "@/db";
import { siteSettings } from "@/db/schema";
import { updateAdSettings } from "@/actions/admin-actions";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Megaphone, Layout, Sidebar, LayoutGrid, Info } from "lucide-react";

export default async function AdminAdsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || (session.user as any).role !== "admin") {
    redirect("/dashboard");
  }

  const ads = (await db.query.siteSettings.findFirst()) || {
    adHeadline: "",
    adBannerUrl: "",
    adTargetUrl: "",
    adSideLeftUrl: "",
    adSideLeftTarget: "",
    adSideRightUrl: "",
    adSideRightTarget: "",
    adBottom1Url: "",
    adBottom1Target: "",
    adBottom2Url: "",
    adBottom2Target: "",
    adBottom3Url: "",
    adBottom3Target: "",
  };

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black tracking-tight text-slate-900">Advertisement Management</h1>
         <div className="flex items-center gap-2 text-blue-600 bg-blue-50 px-4 py-2 rounded-lg w-fit border border-blue-100">
            <Info className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">File uploads will be saved to local storage.</p>
         </div>
      </div>

      <form action={updateAdSettings} className="space-y-8" encType="multipart/form-data">
        
        {/* Main Banner */}
        <Card className="border-2 border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                    <Megaphone className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Main Interstitial Banner</CardTitle>
                    <CardDescription>Recommended size: <span className="font-bold text-slate-900 underline">1200 x 675 px</span> (16:9 Aspect Ratio)</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Headline Content</Label>
                <Input name="adHeadline" defaultValue={ads.adHeadline || ""} placeholder="e.g. Special Offer Today!" />
              </div>
              <div className="space-y-2">
                <Label className="font-bold text-slate-700">Upload Banner Image</Label>
                <Input name="adBannerFile" type="file" accept="image/*" className="cursor-pointer bg-white" />
                <p className="text-[10px] text-slate-400">Current: {ads.adBannerUrl || "None"}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700">Target Action URL</Label>
              <Input name="adTargetUrl" defaultValue={ads.adTargetUrl || ""} placeholder="https://..." />
            </div>
          </CardContent>
        </Card>

        {/* Side Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-slate-100 shadow-xl">
                 <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center gap-3">
                    <Sidebar className="w-5 h-5 text-orange-600" />
                    <div>
                        <CardTitle className="text-lg">Left Sidebar Ad</CardTitle>
                        <p className="text-[10px] font-bold text-orange-600">Min: 200 x 600 px</p>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Upload Image</Label>
                        <Input name="adSideLeftFile" type="file" accept="image/*" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Target URL</Label>
                        <Input name="adSideLeftTarget" defaultValue={ads.adSideLeftTarget || ""} placeholder="https://..." />
                    </div>
                 </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 shadow-xl">
                 <CardHeader className="bg-slate-50/50 border-b flex flex-row items-center gap-3">
                    <Sidebar className="w-5 h-5 text-orange-600 rotate-180" />
                    <div>
                        <CardTitle className="text-lg">Right Sidebar Ad</CardTitle>
                        <p className="text-[10px] font-bold text-orange-600">Min: 200 x 600 px</p>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Upload Image</Label>
                        <Input name="adSideRightFile" type="file" accept="image/*" />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-black uppercase text-slate-400">Target URL</Label>
                        <Input name="adSideRightTarget" defaultValue={ads.adSideRightTarget || ""} placeholder="https://..." />
                    </div>
                 </CardContent>
            </Card>
        </div>

        {/* Bottom Banner Grid */}
        <Card className="border-2 border-slate-100 shadow-xl overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b">
             <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg text-green-600">
                    <LayoutGrid className="w-5 h-5" />
                </div>
                <div>
                    <CardTitle className="text-lg">Bottom Banner Trio</CardTitle>
                    <CardDescription>Minimum size per banner: <span className="font-bold text-slate-900 underline">400 x 300 px</span></CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-6">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-4 p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest border-b pb-2">Banner {i}</p>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-700">Upload Image</Label>
                            <Input name={`adBottom${i}File`} type="file" accept="image/*" className="bg-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold text-slate-700">Target URL</Label>
                            <Input name={`adBottom${i}Target`} defaultValue={(ads as any)[`adBottom${i}Target`] || ""} placeholder="https://..." className="bg-white" />
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-4">
             <Button type="submit" size="lg" className="px-12 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl shadow-xl transition-all hover:-translate-y-1">
                SAVE & UPLOAD AD CONTENT
             </Button>
        </div>
      </form>
    </div>
  );
}
