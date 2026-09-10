"use client";

import { useEffect, useState } from "react";
import { getDDSDataUrl } from "@/lib/utils/ddsRenderer";
import { Loader2, Image as ImageIcon } from "lucide-react";

interface DDSIconProps {
  imageRef: string; // e.g., ShopChr001#001
}

export function DDSIcon({ imageRef }: DDSIconProps) {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    
    async function loadIcon() {
      if (!imageRef) return;
      
      try {
        // 1. Get imageset mapping
        const res = await fetch("/api/imageset");
        const { imageSets } = await res.json();
        
        const [setName, imgName] = imageRef.split("#");
        if (imageSets[setName] && imageSets[setName].images[imgName]) {
          const file = imageSets[setName].file;
          const rect = imageSets[setName].images[imgName];
          
          // 2. Load DDS and render crop via WebGL
          const fileUrl = `/api/asset/texture?file=${encodeURIComponent(file)}`;
          const url = await getDDSDataUrl(fileUrl, rect.x, rect.y, rect.width, rect.height);
          
          if (mounted) {
            setDataUrl(url);
            setLoading(false);
          }
        } else {
          setLoading(false);
        }
      } catch (e) {
        console.error("Failed to load DDS icon", e);
        if (mounted) setLoading(false);
      }
    }
    
    loadIcon();
    
    return () => { mounted = false; };
  }, [imageRef]);

  if (loading) {
    return <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded border border-border/50"><Loader2 className="w-4 h-4 animate-spin text-muted-foreground" /></div>;
  }

  if (!dataUrl) {
    return <div className="w-12 h-12 flex items-center justify-center bg-zinc-900 rounded border border-border/50"><ImageIcon className="w-4 h-4 text-muted-foreground/50" /></div>;
  }

  return (
    <img src={dataUrl} alt={imageRef} className="w-12 h-12 object-contain rounded border border-border/50 bg-black/40" />
  );
}
