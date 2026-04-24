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
import { Megaphone, Layout, Sidebar, LayoutGrid, Info, Video, Image as ImageIcon } from "lucide-react";

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
         <div className="flex items-center gap-2 text-indigo-600 bg-indigo-50 px-4 py-2 rounded-lg w-fit border border-indigo-100">
            <Video className="w-4 h-4" />
            <p className="text-xs font-bold uppercase tracking-wider">Now supporting Animated GIFs & MP4 Video Clips (5-15s)</p>
         </div>
      </div>

      <form action={updateAdSettings} className="space-y-8" encType="multipart/form-data">
        
        {/* Main Banner */}
        <Card className="border-2 border-slate-100 shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50/50 border-b p-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-200">
                    <Megaphone className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black">Main Interstitial Banner</CardTitle>
                    <CardDescription className="font-medium">Recommended: <span className="text-slate-900 underline">1200x675px</span> • Formats: <span className="text-blue-600 font-bold italic">JPG, PNG, GIF, MP4</span></CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label className="font-black text-slate-700 text-xs uppercase tracking-widest">Headline Content</Label>
                <Input name="adHeadline" defaultValue={ads.adHeadline || ""} placeholder="e.g. Special Offer Today!" className="h-12 rounded-xl border-slate-200 focus:ring-blue-600" />
              </div>
              <div className="space-y-3">
                <Label className="font-black text-slate-700 text-xs uppercase tracking-widest">Upload Media File</Label>
                <Input name="adBannerFile" type="file" accept="image/*,video/*" className="cursor-pointer h-12 pt-2.5 rounded-xl bg-slate-50 border-dashed border-2 border-slate-200" />
                <p className="text-[10px] text-slate-400 font-medium italic">Current: {ads.adBannerUrl || "No file uploaded"}</p>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="font-black text-slate-700 text-xs uppercase tracking-widest">Target Action URL (Click Redirect)</Label>
              <Input name="adTargetUrl" defaultValue={ads.adTargetUrl || ""} placeholder="https://..." className="h-12 rounded-xl border-slate-200" />
            </div>
          </CardContent>
        </Card>

        {/* Side Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="border-2 border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                 <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                        <Sidebar className="w-5 h-5" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black">Left Sidebar Ad</CardTitle>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter italic">Min: 200 x 600 px</p>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Media File</Label>
                        <Input name="adSideLeftFile" type="file" accept="image/*,video/*" className="rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target URL</Label>
                        <Input name="adSideLeftTarget" defaultValue={ads.adSideLeftTarget || ""} placeholder="https://..." className="rounded-xl" />
                    </div>
                 </CardContent>
            </Card>

            <Card className="border-2 border-slate-100 shadow-xl rounded-3xl overflow-hidden">
                 <CardHeader className="bg-slate-50/50 border-b p-6 flex flex-row items-center gap-4">
                    <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                        <Sidebar className="w-5 h-5 rotate-180" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-black">Right Sidebar Ad</CardTitle>
                        <p className="text-[10px] font-bold text-orange-600 uppercase tracking-tighter italic">Min: 200 x 600 px</p>
                    </div>
                 </CardHeader>
                 <CardContent className="p-6 space-y-6">
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Media File</Label>
                        <Input name="adSideRightFile" type="file" accept="image/*,video/*" className="rounded-xl" />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Target URL</Label>
                        <Input name="adSideRightTarget" defaultValue={ads.adSideRightTarget || ""} placeholder="https://..." className="rounded-xl" />
                    </div>
                 </CardContent>
            </Card>
        </div>

        {/* Bottom Banner Grid */}
        <Card className="border-2 border-slate-100 shadow-xl overflow-hidden rounded-3xl">
          <CardHeader className="bg-slate-50/50 border-b p-8">
             <div className="flex items-center gap-4">
                <div className="p-3 bg-green-600 rounded-2xl text-white shadow-lg shadow-green-100">
                    <LayoutGrid className="w-6 h-6" />
                </div>
                <div>
                    <CardTitle className="text-xl font-black">Bottom Banner Grid</CardTitle>
                    <CardDescription className="font-medium">Supports <span className="font-bold text-slate-900">Videos & GIFs</span>. Min: 400x300px per slot.</CardDescription>
                </div>
             </div>
          </CardHeader>
          <CardContent className="p-8">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="space-y-5 p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
                        <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Slot 0{i}</p>
                            <ImageIcon className="w-3 h-3 text-slate-300" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Media File</Label>
                            <Input name={`adBottom${i}File`} type="file" accept="image/*,video/*" className="bg-white rounded-xl border-slate-200" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Target URL</Label>
                            <Input name={`adBottom${i}Target`} defaultValue={(ads as any)[`adBottom${i}Target`] || ""} placeholder="https://..." className="bg-white rounded-xl border-slate-200" />
                        </div>
                    </div>
                ))}
             </div>
          </CardContent>
        </Card>

        <div className="flex justify-end pt-6">
             <Button type="submit" size="lg" className="px-16 h-16 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-lg rounded-2xl shadow-2xl transition-all hover:-translate-y-2 hover:shadow-indigo-200 active:scale-95">
                PUBLISH ALL AD UPDATES
             </Button>
        </div>
      </form>
    </div>
  );
}
