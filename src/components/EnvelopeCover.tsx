import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FirestoreImage } from "./FirestoreImage";
import { fetchFromFsdb } from "../lib/fsdb";

interface EnvelopeCoverProps {
  isOpen: boolean;
  onOpen: () => void;
  onSealTap?: () => void;
  openingBackgroundImageUrl: string;
  openingSealImageUrl: string;
  openingVideoUrl: string;
}

export const EnvelopeCover: React.FC<EnvelopeCoverProps> = ({
  onOpen,
  onSealTap,
  openingBackgroundImageUrl,
  openingSealImageUrl,
  openingVideoUrl
}) => {
  const [isOpening, setIsOpening] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [resolvedVideoUrl, setResolvedVideoUrl] = useState<string>("");

  useEffect(() => {
    if (openingVideoUrl) {
      if (openingVideoUrl.startsWith("fsdb://")) {
        fetchFromFsdb(openingVideoUrl).then(url => {
          if (url) setResolvedVideoUrl(url);
        });
      } else {
        setResolvedVideoUrl(openingVideoUrl);
      }
    } else {
      setResolvedVideoUrl("");
    }
  }, [openingVideoUrl]);

  const handleOpen = () => {
    if (isOpening) return;
    setIsOpening(true);
    
    if (onSealTap) {
      onSealTap();
    }
    
    if (resolvedVideoUrl && videoRef.current) {
      // Play immediately to ensure user interaction token is used
      setVideoPlaying(true);
      videoRef.current.play().catch(e => {
        console.warn("Video play failed:", e);
      });
    } else {
      setTimeout(() => {
        onOpen();
      }, 500);
    }
  };

  const handleVideoEnded = () => {
    onOpen();
  };

  return (
    <motion.div
      exit={{ opacity: 0, transition: { duration: 1 } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-black cursor-pointer"
      onClick={handleOpen}
    >
      <AnimatePresence>
        {!videoPlaying && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 z-10"
          >
            {openingBackgroundImageUrl && (
              <FirestoreImage 
                src={openingBackgroundImageUrl} 
                alt="Background" 
                className="w-full h-full object-cover object-center" 
              />
            )}
            
          </motion.div>
        )}
      </AnimatePresence>

      {resolvedVideoUrl && (
        <motion.div 
          animate={{ opacity: videoPlaying ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          className="absolute inset-0 z-10"
          style={{ pointerEvents: videoPlaying ? 'auto' : 'none' }}
        >
          <video 
            ref={videoRef}
            src={resolvedVideoUrl || undefined}
            className="w-full h-full object-cover object-center"
            onEnded={handleVideoEnded}
            onError={() => {
              if (isOpening) onOpen();
            }}
            playsInline
          />
        </motion.div>
      )}

      
    </motion.div>
  );
};

