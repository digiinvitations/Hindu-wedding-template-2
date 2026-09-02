import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { WeddingConfig } from '../weddingConfig';
import { fetchFromFsdb } from '../lib/fsdb';
import { Flower2, Loader2 } from 'lucide-react';

interface PreloaderProps {
  config: WeddingConfig | null;
  onComplete: () => void;
}

export function Preloader({ config, onComplete }: PreloaderProps) {
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("Preparing...");

  useEffect(() => {
    if (!config) return;

    let isMounted = true;

    const loadAssets = async () => {
      setStatus("Loading resources...");
      const urls: string[] = [];
      if (config.openingBackgroundImageUrl) urls.push(config.openingBackgroundImageUrl);
      if (config.openingSealImageUrl) urls.push(config.openingSealImageUrl);
      if (config.openingVideoUrl) urls.push(config.openingVideoUrl);
      if (config.heroImageUrl) urls.push(config.heroImageUrl);
      if (config.envelopeIconUrl) urls.push(config.envelopeIconUrl);
      if (config.thankYouImageUrl) urls.push(config.thankYouImageUrl);
      if (config.bride?.imageUrl) urls.push(config.bride.imageUrl);
      if (config.groom?.imageUrl) urls.push(config.groom.imageUrl);
      if (config.heroSettings?.ganeshaIconUrl) urls.push(config.heroSettings.ganeshaIconUrl);
      
      config.galleryImages?.forEach(img => { if (img.url) urls.push(img.url); });
      config.weddingEvents?.forEach(ev => { if (ev.thumbnailUrl) urls.push(ev.thumbnailUrl); });

      const uniqueUrls = [...new Set(urls.filter(Boolean))];
      
      if (uniqueUrls.length === 0) {
         if (isMounted) { setProgress(100); setTimeout(onComplete, 500); }
         return;
      }

      let loadedCount = 0;

      const loadResource = async (url: string) => {
        try {
           let finalUrl = url;
           if (url.startsWith('fsdb://')) {
             finalUrl = await fetchFromFsdb(url);
           }
           
           if (finalUrl.match(/\.(mp4|webm|mov)$/i) || url.includes('video')) {
              const video = document.createElement('video');
              video.preload = 'auto';
              video.muted = true;
              video.playsInline = true;
              video.src = finalUrl;
              await new Promise((resolve) => {
                 video.onloadeddata = resolve;
                 video.onerror = resolve;
                 setTimeout(resolve, 4000); // limit video wait
              });
           } else {
              const img = new Image();
              img.src = finalUrl;
              await new Promise((resolve) => {
                 img.onload = resolve;
                 img.onerror = resolve;
              });
           }
        } catch(e) {
           console.warn("Failed to preload:", url);
        }
      };

      await Promise.all(uniqueUrls.map(async (url) => {
         await loadResource(url);
         if (isMounted) {
            loadedCount++;
            setProgress(Math.floor((loadedCount / uniqueUrls.length) * 100));
         }
      }));

      if (isMounted) {
         setStatus("Ready");
         setTimeout(onComplete, 800);
      }
    };

    loadAssets();

    const fallbackTimeout = setTimeout(() => {
      if (isMounted) onComplete();
    }, 15000); // max 15 seconds wait

    return () => {
      isMounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, [config, onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] bg-[#FFF9F3] flex flex-col items-center justify-center p-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        className="mb-8 text-[#C9A45C]"
      >
        <Flower2 size={48} />
      </motion.div>
      <h2 className="font-display text-2xl md:text-3xl text-[#84571f] mb-4 text-center">
        Loading Your Invitation
      </h2>
      
      {!config ? (
        <div className="flex items-center gap-2 text-[#a77528]">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="font-serif-premium italic">Fetching details...</span>
        </div>
      ) : (
        <>
          <div className="w-full max-w-xs h-1 bg-[#ebdbae] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-[#C9A45C]"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.2 }}
            />
          </div>
          <p className="mt-4 font-serif-premium text-[#a77528] italic">
            {status} ({progress}%)
          </p>
        </>
      )}
    </motion.div>
  );
}
