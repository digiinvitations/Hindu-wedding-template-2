import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { FirestoreImage } from "./components/FirestoreImage";
import { fetchFromFsdb } from "./lib/fsdb";
import {
  Calendar,
  MapPin,
  Clock,
  ChevronUp, ChevronLeft, ChevronRight,
  Heart,
  Send,
  Users,
  Phone,
  User,
  MessageSquare,
  Volume2,
  VolumeX,
  Lock,
  Settings,
  ExternalLink,
  Instagram,
  Facebook,
  Maximize2,
  Flower2
} from "lucide-react";

import { weddingConfig as defaultWeddingConfig, WeddingConfig } from "./weddingConfig";
import { GaneshaIcon } from "./components/GaneshaIcon";
import { OrnateFrame } from "./components/OrnateFrame";
import { EnvelopeCover } from "./components/EnvelopeCover";
import { RSVPModal } from "./components/RSVPModal";
import { AdminPanel } from "./components/AdminPanel";
import { ScratchReveal } from "./components/ScratchReveal";
import { FallingFlowers } from "./components/FallingFlowers";
import { FallingPetals } from "./components/FallingPetals";
import { SectionSeparator } from "./components/SectionSeparator";
import { Countdown } from "./components/Countdown";
import confetti from "canvas-confetti";

import { saveConfigToDb, addRsvpToDb, fetchConfigFromDb } from "./lib/db";

const TurbanIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12 4C8 4 5 7 5 11C5 12 5.5 13.5 7 15L12 17L17 15C18.5 13.5 19 12 19 11C19 7 16 4 12 4Z" fill="currentColor" opacity="0.9"/>
    <path d="M7 15C6 16 5 17 5 19C5 21 8 22 12 22C16 22 19 21 19 19C19 17 18 16 17 15L12 17L7 15Z" fill="currentColor" opacity="0.7"/>
    <path d="M12 4L13.5 1L12 2L10.5 1L12 4Z" fill="#dec47f" />
    <circle cx="12" cy="8" r="2" fill="#dec47f" />
  </svg>
);

const BindiIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="14" r="3.5" fill="#dc2626" />
    <circle cx="12" cy="7" r="1.5" fill="currentColor" />
    <circle cx="12" cy="3" r="1" fill="currentColor" />
    <circle cx="17" cy="11" r="1" fill="currentColor" />
    <circle cx="7" cy="11" r="1" fill="currentColor" />
  </svg>
);

export default function App() {
  // Config state for dynamic management
  const [config, setConfig] = useState<WeddingConfig>(() => {
    try {
      const stored = localStorage.getItem("wedding_config");
      if (stored) {
        const configData = JSON.parse(stored);
        return {
          ...defaultWeddingConfig,
          ...configData,
          weddingEvents: Array.isArray(configData.weddingEvents) ? configData.weddingEvents : defaultWeddingConfig.weddingEvents,
          galleryImages: configData.galleryImages || defaultWeddingConfig.galleryImages,
          groom: { ...defaultWeddingConfig.groom, ...(configData.groom || {}) },
          bride: { ...defaultWeddingConfig.bride, ...(configData.bride || {}) },
        };
      }
    } catch (e) {
      console.warn("Failed to load config from localStorage", e);
    }
    return defaultWeddingConfig;
  });

  useEffect(() => {
    // 1. Fetch permanent config from backend server on mount
    fetchConfigFromDb().then((serverConfig) => {
      if (serverConfig) {
        setConfig({
          ...defaultWeddingConfig,
          ...serverConfig,

          weddingEvents: Array.isArray(serverConfig.weddingEvents) ? serverConfig.weddingEvents : defaultWeddingConfig.weddingEvents,
          galleryImages: serverConfig.galleryImages || defaultWeddingConfig.galleryImages,
          groom: { ...defaultWeddingConfig.groom, ...(serverConfig.groom || {}) },
          bride: { ...defaultWeddingConfig.bride, ...(serverConfig.bride || {}) },
        });
      }
    });
  }, []);

  useEffect(() => {
    // Synchronize configuration changes across instances/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "wedding_config" && e.newValue) {
        try {
          const configData = JSON.parse(e.newValue);
          setConfig({
            ...defaultWeddingConfig,
            ...configData,

            weddingEvents: Array.isArray(configData.weddingEvents) ? configData.weddingEvents : defaultWeddingConfig.weddingEvents,
            galleryImages: configData.galleryImages || defaultWeddingConfig.galleryImages,
            groom: { ...defaultWeddingConfig.groom, ...(configData.groom || {}) },
            bride: { ...defaultWeddingConfig.bride, ...(configData.bride || {}) },
          });
        } catch (err) {
          console.warn("Failed to parse storage update", err);
        }
      }
    };
    
    // Custom event to handle updates within the same window
    const handleLocalConfigUpdate = () => {
      try {
        const stored = localStorage.getItem("wedding_config");
        if (stored) {
          const configData = JSON.parse(stored);
          setConfig({
            ...defaultWeddingConfig,
            ...configData,

            weddingEvents: Array.isArray(configData.weddingEvents) ? configData.weddingEvents : defaultWeddingConfig.weddingEvents,
            galleryImages: configData.galleryImages || defaultWeddingConfig.galleryImages,
            groom: { ...defaultWeddingConfig.groom, ...(configData.groom || {}) },
            bride: { ...defaultWeddingConfig.bride, ...(configData.bride || {}) },
          });
        }
      } catch (err) {
        console.warn("Failed to parse local config update", err);
      }
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("wedding_config_updated", handleLocalConfigUpdate);
    


  return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("wedding_config_updated", handleLocalConfigUpdate);
    };
  }, []);

  const handleConfigChange = async (newConfig: WeddingConfig) => {
    setConfig(newConfig);
    try {
      await saveConfigToDb(newConfig);
    } catch (e) {
      console.warn("Failed to save config.", e);
      alert("Failed to save changes: " + (e instanceof Error ? e.message : String(e)));
    }
  };

  // Opening flow states
  const [isOpened, setIsOpened] = useState(false);
  const [isDateRevealed, setIsDateRevealed] = useState(false);
  const [isMonthRevealed, setIsMonthRevealed] = useState(false);
  const [isYearRevealed, setIsYearRevealed] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);

  const allHeartsScratched = isDateRevealed && isMonthRevealed && isYearRevealed;
  const musicPlayingRef = useRef(musicPlaying);
  
  // Parse wedding date parts safely
  const dObj = new Date(config.weddingDate);
  let dateOfMarry = "12th";
  let monthOfMarry = "December";
  let yearOfMarry = "2026";

  if (!isNaN(dObj.getTime())) {
    const dayNum = dObj.getDate();
    const getOrdinal = (n: number) => {
      const s = ["th", "st", "nd", "rd"];
      const v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    };
    dateOfMarry = getOrdinal(dayNum);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    monthOfMarry = months[dObj.getMonth()];
    yearOfMarry = dObj.getFullYear().toString();
  } else if (config.displayDate) {
    const cleaned = config.displayDate.replace(/^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s*/i, '');
    const parts = cleaned.split(/\s+/);
    if (parts.length >= 3) {
      dateOfMarry = parts[0];
      monthOfMarry = parts[1].substring(0, 3);
      yearOfMarry = parts[2];
    }
  }
  
  useEffect(() => {
    musicPlayingRef.current = musicPlaying;
  }, [musicPlaying]);

  // Celebration animation when hearts are scratched
  useEffect(() => {
    if (allHeartsScratched) {
      const duration = 4000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 8,
          angle: 60,
          spread: 80,
          origin: { x: 0, y: 0.8 },
          colors: ['#fcd34d', '#f87171', '#c084fc', '#f472b6', '#ffffff']
        });
        confetti({
          particleCount: 8,
          angle: 120,
          spread: 80,
          origin: { x: 1, y: 0.8 },
          colors: ['#fcd34d', '#f87171', '#c084fc', '#f472b6', '#ffffff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [allHeartsScratched]);



  // RSVP Form states
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpAttend, setRsvpAttend] = useState<boolean | null>(true); // default attending
  const [rsvpMessage, setRsvpMessage] = useState("");
  const [showRsvpModal, setShowRsvpModal] = useState(false);

  // Host Dashboard / Admin state
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [actualMusicUrl, setActualMusicUrl] = useState("");
  const [showAdmin, setShowAdmin] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Handle Audio Player
  useEffect(() => {
    let isCancelled = false;

    if (!config.musicUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      setActualMusicUrl("");
      return;
    }

    const loadAudio = async () => {
      try {
        let url = await fetchFromFsdb(config.musicUrl);
        if (isCancelled || !url) return;
        
        // Convert data URL to Blob URL for better audio playback support
        if (url.startsWith("data:audio")) {
          try {
            const parts = url.split(",");
            const mime = parts[0].match(/:(.*?);/)[1];
            const bstr = atob(parts[1]);
            let n = bstr.length;
            const u8arr = new Uint8Array(n);
            while (n--) {
              u8arr[n] = bstr.charCodeAt(n);
            }
            const blob = new Blob([u8arr], { type: mime });
            url = URL.createObjectURL(blob);
          } catch (e) {
            console.warn("Failed to convert audio base64 to blob", e);
          }
        }
        
        setActualMusicUrl(url);
      } catch (e) {
        console.log("Failed to load audio", e);
      }
    };
    loadAudio();

    return () => {
      isCancelled = true;
    };
  }, [config.musicUrl]);

  // Handle auto-play when url changes and it should be playing
  useEffect(() => {
    if (actualMusicUrl && musicPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play blocked", e));
    }
  }, [actualMusicUrl, musicPlaying]);

  // Handle Scroll Progress & Scroll-to-Top visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show scroll-to-top button after 500px scroll
      setShowScrollTop(window.scrollY > 500);

      // Scroll progress percentage
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setScrollProgress((window.scrollY / totalHeight) * 100);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const handleStartMusic = () => {
    setMusicPlaying(true);
    // Try to auto-play background shehnai music
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setMusicPlaying(true))
        .catch((error) => {
          console.log("Audio play blocked by browser. User interaction should allow it.", error);
          // Set to playing state anyway so the user sees play toggle works on next action
          setMusicPlaying(true);
          // Retry playing on body tap
          const retryPlay = () => {
            audioRef.current?.play().then(() => {
              setMusicPlaying(true);
              document.body.removeEventListener("click", retryPlay);
            }).catch(e => {
              console.log("Retry play failed:", e);
              document.body.removeEventListener("click", retryPlay);
            });
          };
          document.body.addEventListener("click", retryPlay);
        });
    }
  };

  // Handle opening the envelope
  const handleOpenEnvelope = () => {
    setIsOpened(true);
  };

  // Toggle Background Music
  const toggleMusic = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    
    if (musicPlaying) {
      audioRef.current?.pause();
      setMusicPlaying(false);
    } else {
      audioRef.current?.play()
        .then(() => setMusicPlaying(true))
        .catch(err => console.log("Could not play audio", err));
    }
  };

  // Scroll to target section smoothly
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Handle RSVP Submission
  const handleRSVPSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim() || !rsvpPhone.trim() || rsvpAttend === null) {
      alert("Please fill in your Name, Phone Number, and RSVP Status.");
      return;
    }

    // Save RSVP to database
    const newRsvp = {
      name: rsvpName,
      phone: rsvpPhone,
      guestsCount: rsvpAttend ? rsvpGuests : 0,
      attend: rsvpAttend,
      message: rsvpMessage,
      timestamp: new Date().toISOString()
    };

    addRsvpToDb(newRsvp)
      .then(() => {
        // Show Confirmation Modal
        setShowRsvpModal(true);
        if (rsvpAttend) {
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#dec47f', '#962325', '#f8d98d']
          });
        }
      })
      .catch(err => {
        console.warn("Error adding RSVP: ", err);
        alert("Failed to submit RSVP: " + (err instanceof Error ? err.message : String(err)));
      });
  };

  const handleModalClose = () => {
    setShowRsvpModal(false);
    // Reset RSVP Form (excluding attend status for UX)
    setRsvpName("");
    setRsvpPhone("");
    setRsvpGuests(1);
    setRsvpMessage("");
  };

  const carouselRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!carouselRef.current || isHovering) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: clientWidth > 600 ? 400 : 300, behavior: 'smooth' });
        }
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [isHovering]);

  const scrollPrev = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -(carouselRef.current.clientWidth > 600 ? 400 : 300), behavior: 'smooth' });
    }
  };

  const scrollNext = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: carouselRef.current.clientWidth > 600 ? 400 : 300, behavior: 'smooth' });
    }
  };
  return (
    <div className="min-h-[100dvh] bg-[#FFF8F3] bg-gradient-to-b from-[#FFF8F3] to-[#ffece0] font-sans relative text-gray-800">
      
      <audio ref={audioRef} src={actualMusicUrl || undefined} loop preload="auto" playsInline className="hidden" onError={(e) => console.warn("Audio could not load.")} onPlay={() => console.log("Audio playing!")} />
      
      {/* 1. OVERLAY ENVELOPE COVER (Opening Screen) */}
      <AnimatePresence>
        {!isOpened && (
          <EnvelopeCover
            key="envelope"
            isOpen={isOpened}
            onOpen={handleOpenEnvelope}
            onSealTap={handleStartMusic}
            openingBackgroundImageUrl={config.openingBackgroundImageUrl}
            openingSealImageUrl={config.openingSealImageUrl}
            openingVideoUrl={config.openingVideoUrl}
          />
        )}
      </AnimatePresence>

      {/* BACKGROUND DECORATIVE MANDALAS (for luxury depth) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[20%] left-[-150px] w-[400px] h-[400px] rounded-full border border-gold-400/10 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-dashed border-gold-400/5 animate-[spin_120s_linear_infinite]" />
        </div>
        <div className="absolute top-[50%] right-[-150px] w-[400px] h-[400px] rounded-full border border-gold-400/10 flex items-center justify-center">
          <div className="w-[300px] h-[300px] rounded-full border border-dashed border-gold-400/5 animate-[spin_100s_linear_reverse_infinite]" />
        </div>
        <div className="absolute bottom-[10%] left-[-100px] w-[300px] h-[300px] rounded-full border border-gold-400/5" />
      </div>

      {/* SCROLL PROGRESS INDICATOR BAR */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-gold-600 via-gold-400 to-gold-200 z-50 shadow-md transition-all duration-100"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* MAIN LAYOUT WRAPPER (Fade in after envelope opens) */}
      <div className={`${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-1000 relative z-10`}>
        
        {/* Global Falling Petals */}
        <FallingPetals active={config.heroSettings?.showPetals ?? true} count={40} className="z-[100]" />

        {/* SCRATCH CARD REVEAL SECTION */}
        <motion.section 
          id="scratch-reveal" 
          initial={{ opacity: 0, y: 30 }} 
          whileInView={{ opacity: 1, y: 0 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="min-h-[100dvh] justify-center py-16 px-4 md:px-8 max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center"
        >
          {/* Beautiful "SAVE THE DATE ❤️" Tagline */}
          <div className="mb-6 md:mb-8">
            <span className="font-display text-2xl md:text-4xl text-red-600 tracking-[0.2em] font-extrabold drop-shadow-md flex items-center justify-center gap-2">
              SAVE THE DATE ❤️
            </span>
            <p className="text-xs font-sans text-gold-700/80 uppercase tracking-[0.3em] font-semibold mt-1.5">
              Scratch the hearts to reveal
            </p>
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent via-gold-500 to-transparent mx-auto mt-3" />
          </div>

          {/* 3 Red Hearts container */}
          <div className="flex flex-row flex-nowrap justify-center items-center gap-4 sm:gap-6 md:gap-8 px-2 py-4 w-full overflow-x-auto no-scrollbar">
            {/* Heart 1: Date */}
            <div className="flex flex-col items-center shrink-0">
              <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold-700 font-extrabold mb-2.5 drop-shadow-sm">
                DATE
              </span>
              <div className="p-1.5 bg-white/5 rounded-2xl border border-gold-500/15 shadow-xl inline-block">
                <ScratchReveal
                  width={90}
                  height={90}
                  onReveal={() => setIsDateRevealed(true)}
                  content={
                    <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center p-1 overflow-hidden transition-all duration-500 ${
                      isDateRevealed 
                        ? "bg-[#FFF8F3] border border-pink-200/50 shadow-inner" 
                        : "bg-transparent border-transparent"
                    }`}>
                      <span className="font-sans text-xs sm:text-sm font-black text-pink-600 tracking-wide leading-none drop-shadow-sm">
                        {dateOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 2: Month */}
            <div className="flex flex-col items-center shrink-0">
              <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold-700 font-extrabold mb-2.5 drop-shadow-sm">
                MONTH
              </span>
              <div className="p-1.5 bg-white/5 rounded-2xl border border-gold-500/15 shadow-xl inline-block">
                <ScratchReveal
                  width={90}
                  height={90}
                  onReveal={() => setIsMonthRevealed(true)}
                  content={
                    <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center p-1 overflow-hidden transition-all duration-500 ${
                      isMonthRevealed 
                        ? "bg-[#FFF8F3] border border-pink-200/50 shadow-inner" 
                        : "bg-transparent border-transparent"
                    }`}>
                      <span className="font-sans text-xs sm:text-sm font-black text-pink-600 uppercase tracking-widest leading-none drop-shadow-sm truncate max-w-[58px]">
                        {monthOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 3: Year */}
            <div className="flex flex-col items-center shrink-0">
              <span className="font-sans text-[11px] sm:text-xs uppercase tracking-[0.2em] text-gold-700 font-extrabold mb-2.5 drop-shadow-sm">
                YEAR
              </span>
              <div className="p-1.5 bg-white/5 rounded-2xl border border-gold-500/15 shadow-xl inline-block">
                <ScratchReveal
                  width={90}
                  height={90}
                  onReveal={() => setIsYearRevealed(true)}
                  content={
                    <div className={`w-[76px] h-[76px] rounded-full flex items-center justify-center p-1 overflow-hidden transition-all duration-500 ${
                      isYearRevealed 
                        ? "bg-[#FFF8F3] border border-pink-200/50 shadow-inner" 
                        : "bg-transparent border-transparent"
                    }`}>
                      <span className="font-sans text-xs sm:text-sm font-black text-pink-600 tracking-wide leading-none drop-shadow-sm">
                        {yearOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>
        </motion.section>

        {allHeartsScratched && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            {/* FOOTER */}
        <footer className="py-10 bg-[#FFF8F3] text-center relative z-10 flex flex-col justify-center items-center overflow-hidden">
          <div className="absolute inset-0 bg-pink-50/50 pointer-events-none" />

          <div className="relative border border-pink-300 px-6 md:px-10 py-3 bg-white/90 shadow-sm mb-6 rounded-sm">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.2em] md:tracking-[0.3em] text-pink-800/80 font-bold whitespace-nowrap">
              Create with <span className="text-pink-600 animate-pulse inline-block mx-1">❤️</span> by digiinvitations_
            </span>
          </div>
          

        </footer>
          </motion.div>
        )}

      </div>
      {/* 13. FLOATING BUTTONS */}
      {/* Music Floating Toggle (Bottom Left) */}
      {isOpened && (
        <div className="fixed bottom-6 left-6 z-40 flex items-center gap-3 group">
          <div className="relative">
            {/* Flower decorations */}
            <div className="absolute -top-3 -left-3 text-pink-400 rotate-12 opacity-80 pointer-events-none transition-transform group-hover:scale-110">
              <Flower2 size={20} />
            </div>
            <div className="absolute -bottom-2 -right-2 text-pink-500 -rotate-12 opacity-80 pointer-events-none transition-transform group-hover:scale-110">
              <Flower2 size={16} />
            </div>
            <button
              onClick={toggleMusic}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-xl cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 border border-pink-300 ${
                musicPlaying ? "bg-gradient-to-br from-pink-400 to-pink-600 text-white animate-[spin_8s_linear_infinite]" : "bg-white text-red-500"
              }`}
              title={musicPlaying ? "Mute Background Music" : "Play Background Music"}
            >
              {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
          
          {/* Animated Music Wave Bars (Saves user having to guess if it's active) */}
          {musicPlaying && (
            <div className="flex items-end gap-0.5 h-6 bg-white/90 p-1.5 rounded-md border border-pink-300/30 pointer-events-none shadow-sm">
              <span className="w-0.5 h-full bg-pink-500 rounded-sm animate-[pulse_1s_infinite_100ms]" style={{ minHeight: "6px" }} />
              <span className="w-0.5 h-full bg-pink-500 rounded-sm animate-[pulse_1s_infinite_300ms]" style={{ minHeight: "12px" }} />
              <span className="w-0.5 h-full bg-pink-500 rounded-sm animate-[pulse_1s_infinite_500ms]" style={{ minHeight: "8px" }} />
            </div>
          )}
        </div>
      )}

            {/* Admin Floating Toggle (Bottom Right above Scroll-to-Top) */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            key="admin-toggle"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-40 group"
          >
            <div className="relative">
              <button
                onClick={() => setShowAdmin(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-purple-600 text-white font-bold flex items-center justify-center shadow-xl border border-purple-300 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Open Admin Panel"
              >
                <Settings size={20} className="stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll-to-Top Toggle (Bottom Right) */}
      <AnimatePresence>
        {isOpened && showScrollTop && (
          <motion.div
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 right-6 z-40 group"
          >
            <div className="relative">
              <div className="absolute -top-3 -right-3 text-pink-400 rotate-[30deg] opacity-80 pointer-events-none transition-transform group-hover:scale-110">
                <Flower2 size={20} />
              </div>
              <div className="absolute -bottom-2 -left-2 text-pink-500 -rotate-[20deg] opacity-80 pointer-events-none transition-transform group-hover:scale-110">
                <Flower2 size={16} />
              </div>
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-400 to-pink-600 text-white font-bold flex items-center justify-center shadow-xl border border-pink-300 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Scroll To Top"
              >
                <ChevronUp size={20} className="stroke-[3]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>



      {/* RSVP Confirmation Modal */}
      <RSVPModal
        isOpen={showRsvpModal}
        onClose={handleModalClose}
        guestName={rsvpName}
        isAttending={rsvpAttend === true}
        guestsCount={rsvpGuests}
        weddingDate={config.weddingDate}
      />

      {/* Admin Dashboard Drawer/Modal */}
      <AdminPanel
        isOpen={showAdmin}
        onClose={() => setShowAdmin(false)}
        config={config}
        onConfigChange={handleConfigChange}
      />

    </div>
  );
}
