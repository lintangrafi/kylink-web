"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";

interface InterstitialAdProps {
  targetUrl: string;
  adBanner: string;
  adTarget: string;
  headline: string;
}

export function InterstitialAd({ targetUrl, adBanner, adTarget, headline }: InterstitialAdProps) {
  const [timeLeft, setTimeLeft] = useState(10);
  const [canRedirect, setCanRedirect] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setCanRedirect(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleRedirect = () => {
    if (canRedirect) {
      window.location.href = targetUrl;
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Ad Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100">
        <div className="bg-slate-50 px-6 py-3 border-b flex items-center justify-between">
           <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Sponsor Message</span>
           </div>
           <div className="flex items-center gap-2">
              <Clock className="w-3 h-3 text-slate-400" />
              <span className="text-[10px] font-bold text-slate-400">{timeLeft}s remaining</span>
           </div>
        </div>
        
        <div className="p-8">
           <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">{headline}</h2>
           
           <a href={adTarget} target="_blank" rel="noopener noreferrer" className="block relative group rounded-2xl overflow-hidden shadow-lg border-4 border-slate-50 aspect-video">
              <img 
                src={adBanner} 
                alt="Advertisement" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1.5 rounded-full text-[10px] font-black shadow-lg">
                  SPONSORED ↗
              </div>
           </a>
        </div>

        <div className="bg-slate-50 p-6 border-t">
          <Button
            onClick={handleRedirect}
            disabled={!canRedirect}
            size="lg"
            className={`w-full h-16 text-xl font-black rounded-2xl shadow-xl transition-all duration-500 overflow-hidden relative group ${
              canRedirect 
                ? "bg-blue-600 hover:bg-blue-700 text-white hover:-translate-y-1" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {canRedirect ? (
              <span className="flex items-center gap-3">
                CONTINUE TO DESTINATION
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Clock className="w-6 h-6 animate-spin" />
                PLEASE WAIT {timeLeft}S...
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
