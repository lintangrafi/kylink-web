"use client";

import { QrCode, Download } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRef } from "react";

interface QrDialogProps {
  url: string;
  slug: string;
}

export function QrDialog({ url, slug }: QrDialogProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Fill white background
      if (ctx) {
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      }
      
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.download = `qr-${slug}.png`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <Dialog>
      <DialogTrigger 
        render={<Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50" />}
      >
        <QrCode className="h-4 w-4" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>QR Code for /{slug}</DialogTitle>
          <DialogDescription>
            Scan to securely open the shortened link.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-6 py-4">
          <div ref={qrRef} className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
            <QRCode value={url} size={256} className="h-auto max-w-full" />
          </div>
          <Button onClick={downloadQR} className="w-full sm:w-auto flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
            <Download className="w-4 h-4" />
            Download Built-in QR (PNG)
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
