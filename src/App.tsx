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
      throw e;
    }
  };

  // Opening flow states
  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const date = new Date(dateStr);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const trueDate = new Date(date.getTime() + userTimezoneOffset);
      return trueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return dateStr;
  };

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
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [adminLoginError, setAdminLoginError] = useState(false);

  
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
      
      <div className={`${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-1000 relative z-10 bg-[#FFF9F3] text-[#4B3A35] font-serif-premium`}>
        
        {/* Subtle Paper Texture SVG Filter */}
        <div className="fixed inset-0 opacity-[0.25] pointer-events-none z-0" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")" }}></div>

        {/* Global Falling Petals */}
        <FallingPetals active={config.heroSettings?.showPetals ?? true} count={30} className="z-[100] pointer-events-none fixed" />

        {/* 1. HERO / WEDDING INTRODUCTION */}
        <section id="hero" className="relative min-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] mx-auto flex flex-col justify-center items-center text-center px-6 py-16 overflow-hidden">
          
          {/* Background Video/Color */}
          {config.heroSettings?.bgVideoUrl ? (
            <div className="absolute inset-0 z-0">
              <video 
                src={config.heroSettings.bgVideoUrl} 
                className="w-full h-full object-cover opacity-80"
                autoPlay 
                loop 
                muted 
                playsInline
              />
              <div className="absolute inset-0 bg-[#FFF9F3]/30 mix-blend-overlay pointer-events-none" />
            </div>
          ) : (
            <div className="absolute inset-0 pointer-events-none opacity-40 flex flex-col justify-between z-0">
              <div className="w-full h-40 bg-gradient-to-b from-[#FFF9F3] to-transparent z-10 absolute top-0" />
              <div className="absolute top-[-30px] left-[-30px] w-64 h-64 bg-[radial-gradient(circle_at_center,#B94E2F_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-20" />
              <div className="absolute bottom-[-30px] right-[-30px] w-64 h-64 bg-[radial-gradient(circle_at_center,#C9A45C_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-20" />
            </div>
          )}

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center bg-white/75 backdrop-blur-xl rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-[#C9A45C]/40 my-auto"
          >
            {/* Corner Decorative Lines */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C9A45C]/60 rounded-tl-xl" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#C9A45C]/60 rounded-tr-xl" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#C9A45C]/60 rounded-bl-xl" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C9A45C]/60 rounded-br-xl" />

            {/* Ganesha Motif or Image */}
            <div className="w-16 h-16 flex items-center justify-center mb-5 text-[#B94E2F]">
              {config.heroSettings?.ganeshaIconUrl ? (
                <img src={config.heroSettings.ganeshaIconUrl} alt="Ganesha" className="w-full h-full object-contain" />
              ) : (
                <GaneshaIcon className="w-14 h-14 opacity-90" />
              )}
            </div>

            {/* Shloka */}
            {config.heroSettings?.shloka && (
              <div className="mb-8 whitespace-pre-line text-xs text-[#C9A45C] font-semibold tracking-wider leading-relaxed">
                {config.heroSettings.shloka}
              </div>
            )}

            {/* Intro Text */}
            <p className="text-[#4B3A35] max-w-[95%] mx-auto text-[13px] md:text-sm leading-relaxed mb-10 italic">
              {config.heroSettings?.introText || '"With the blessings of the Almighty & our respected elders,\nwe joyfully request your gracious presence on the wedding celebration of"'}
            </p>

            {/* Bride Name */}
            <div className="flex flex-col items-center w-full relative">
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.bride.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-6 uppercase tracking-widest text-center">
                {config.heroSettings?.brideParents || `Daughter of ${config.bride.fatherName} & ${config.bride.motherName}`}
              </p>
              
              {/* Separator */}
              <div className="flex items-center justify-center gap-3 w-full mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C9A45C]/50" />
                <span className="font-accent text-3xl text-[#C9A45C]">&amp;</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C9A45C]/50" />
              </div>

              {/* Groom Name */}
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.groom.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-2 uppercase tracking-widest text-center">
                {config.heroSettings?.groomParents || `Son of ${config.groom.fatherName} & ${config.groom.motherName}`}
              </p>
            </div>
          </motion.div>
          
          {/* Scroll Prompt Arrow */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-6 z-10 flex flex-col items-center cursor-pointer select-none text-[#C9A45C] hover:text-[#B94E2F] transition-colors" 
            onClick={() => document.getElementById("scratch-reveal")?.scrollIntoView({behavior: "smooth"})}
          >
            <span className="font-sans text-[9px] uppercase tracking-[0.4em] mb-2 font-semibold">
              Scroll
            </span>
            <motion.div 
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-4 h-4 border-b-2 border-r-2 border-current rotate-45" 
            />
          </motion.div>
        </section>

        {/* Decorative Separator */}
        <div className="w-full max-w-[calc(100dvh*9/16)] mx-auto flex items-center justify-center py-4 relative z-10">
          <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]/60" />
          <div className="w-1.5 h-1.5 rotate-45 border border-[#C9A45C] mx-3" />
          <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]/60" />
        </div>

        {/* 2. SAVE THE DATE & SCRATCH CARDS */}
        <motion.section 
          id="scratch-reveal" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="min-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] mx-auto flex flex-col justify-start pt-24 pb-20 items-center px-4 sm:px-6 relative z-10"
        >
          <div className="text-center mb-10 w-full">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
              SAVE THE DATE
            </span>
            <h2 className="font-accent text-5xl sm:text-6xl text-[#B94E2F] leading-tight ">
              Reveal Our<br/>Big Day
            </h2>
            <p className="font-serif-premium italic text-[#4B3A35] mt-4 text-sm md:text-base">
              Scratch the heart to reveal
            </p>
          </div>

          {/* 3 Red Hearts container (Single Row) */}
          <div className="flex-1 flex flex-col justify-center w-full"><div className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-6 w-full max-w-lg mx-auto overflow-visible px-2">
            {/* Heart 1: Date */}
            <div className="flex flex-col items-center shrink min-w-0 w-1/3">
              <div className="flex-1 w-full max-w-[150px] aspect-[15/13] relative">
                <ScratchReveal
                  width={150}
                  height={130}
                  onReveal={() => setIsDateRevealed(true)}
                  content={
                    <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
                      isDateRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }`}>
                      <span className="font-serif-premium text-4xl sm:text-5xl font-bold text-[#B94E2F]">
                        {dateOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 2: Month */}
            <div className="flex flex-col items-center shrink min-w-0 w-1/3">
              <div className="flex-1 w-full max-w-[150px] aspect-[15/13] relative flex justify-center items-center">
                <ScratchReveal
                  width={150}
                  height={130}
                  onReveal={() => setIsMonthRevealed(true)}
                  content={
                    <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
                      isMonthRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }`}>
                      <span className="font-serif-premium text-3xl sm:text-4xl font-bold text-[#B94E2F] uppercase tracking-widest text-center">
                        {monthOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 3: Year */}
            <div className="flex flex-col items-center shrink min-w-0 w-1/3">
              <div className="flex-1 w-full max-w-[150px] aspect-[15/13] relative flex justify-center items-center">
                <ScratchReveal
                  width={150}
                  height={130}
                  onReveal={() => setIsYearRevealed(true)}
                  content={
                    <div className={`w-full h-full flex items-center justify-center transition-all duration-500 ${
                      isYearRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }`}>
                      <span className="font-serif-premium text-4xl sm:text-5xl font-bold text-[#B94E2F]">
                        {yearOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>
          </div>

          </div>

          {/* COUNTDOWN REVEAL */}
          <AnimatePresence>
            {allHeartsScratched && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: 20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-12 sm:mt-16 text-center overflow-hidden w-full"
              >
                <div className="w-12 h-[1px] bg-[#C9A45C] mx-auto mb-8" />
                <span className="font-accent text-3xl text-[#B94E2F] block mb-6">
                  The start of a beautiful journey...
                </span>
                <Countdown targetDate={config.weddingDate} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Decorative Separator */}
        {allHeartsScratched && config.weddingEvents?.length > 0 && (
          <div className="w-full max-w-[calc(100dvh*9/16)] mx-auto flex items-center justify-center py-4 relative z-10">
            <div className="w-24 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]/60" />
            <div className="w-1.5 h-1.5 rotate-45 border border-[#C9A45C] mx-3" />
            <div className="w-24 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]/60" />
          </div>
        )}

        {/* 3. SACRED CEREMONIES / EVENTS */}
        {allHeartsScratched && config.weddingEvents?.length > 0 && (
          <motion.section 
            id="events"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="py-20 px-4 md:px-8 relative z-10 w-full max-w-[calc(100dvh*9/16)] mx-auto"
          >
            <div className="text-center mb-16">
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
                THE CELEBRATION UNFOLDS
              </span>
              <h2 className="font-accent text-5xl md:text-6xl text-[#B94E2F] ">
                Sacred<br/>Ceremonies
              </h2>
              <div className="flex items-center justify-center mt-6">
                <div className="w-16 h-[1px] bg-[#C9A45C]/50" />
                <div className="w-2 h-2 rotate-45 border border-[#C9A45C] mx-3" />
                <div className="w-16 h-[1px] bg-[#C9A45C]/50" />
              </div>
            </div>

            <div className="flex flex-col gap-20">
              {config.weddingEvents.map((event, index) => {
                return (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6 }}
                    className="flex flex-col items-center text-center"
                  >
                    <span className="font-sans text-xs uppercase tracking-[0.2em] text-[#765E52] font-semibold mb-2">
                      {formatEventDate(event.time)}
                    </span>
                    <h3 className="font-accent text-5xl md:text-6xl text-[#B94E2F] mb-6">
                      {event.eventName}
                    </h3>
                    
                    {/* Media Card */}
                    {event.thumbnailUrl && (
                      <div className="relative w-full max-w-xs md:max-w-sm aspect-[9/16] rounded-2xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] mb-6 border border-white/50">
                        {event.thumbnailUrl?.endsWith('.mp4') || event.thumbnailUrl?.endsWith('.webm') ? (
                          <video 
                            src={event.thumbnailUrl} 
                            className="w-full h-full object-cover"
                            autoPlay 
                            loop 
                            muted 
                            playsInline
                          />
                        ) : (
                          <FirestoreImage 
                            path={event.thumbnailUrl} 
                            alt={event.eventName}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                          />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                      </div>
                    )}

                    <p className="font-serif-premium text-[#4B3A35] text-sm md:text-base mb-6 px-4">
                      {event.venueName}, {event.venueAddress}
                    </p>
                    
                    {(event.mapDirectionsUrl || event.mapEmbedUrl) && (
                      <a 
                        href={event.mapDirectionsUrl || event.mapEmbedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-row items-center gap-2 bg-[#B94E2F] text-white px-6 py-2.5 rounded-full font-sans text-[10px] uppercase tracking-[0.2em] hover:bg-[#8F3B22] transition-colors shadow-md"
                      >
                        <MapPin size={12} />
                        VIEW ON MAPS
                      </a>
                    )}
                    
                    {/* Separator between events */}
                    {index !== config.weddingEvents.length - 1 && (
                      <div className="flex items-center justify-center mt-12 w-full opacity-60">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]" />
                        <div className="w-2 h-2 rotate-45 border border-[#C9A45C] mx-3" />
                        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]" />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* 4. JOIN THE CELEBRATION & FINAL FOOTER */}
        {allHeartsScratched && (
          <>
            <motion.section
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="py-24 px-6 text-center flex flex-col items-center bg-[#FFF9F3] relative z-10 w-full max-w-[calc(100dvh*9/16)] mx-auto"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
                JOIN THE CELEBRATION
              </span>
              <h2 className="font-accent text-5xl md:text-6xl text-[#B94E2F]  mb-4">
                Celebrate<br/>With Us
              </h2>
              <p className="font-serif-premium text-[#765E52] max-w-lg mx-auto leading-relaxed text-sm md:text-base px-4">
                At last, the stars align, the families gather, and a new journey begins. With hearts overflowing with gratitude, we warmly invite you to celebrate our wedding and bless our forever.
              </p>
            </motion.section>

            {/* Deep Burgundy Closing Section */}
            <motion.section
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="py-24 px-6 text-center flex flex-col items-center bg-[#641D2E] relative z-10 overflow-hidden w-full max-w-[calc(100dvh*9/16)] mx-auto rounded-b-[40px] shadow-2xl"
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')] mix-blend-overlay" />
              
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C9A45C] mb-12" />
              
              <h2 className="font-accent text-6xl md:text-7xl text-[#C9A45C]  leading-[1.1] z-10 relative">
                {config.bride.name.split(" ")[0]}
                <br/>
                <span className="text-4xl">&amp;</span>
                <br/>
                {config.groom.name.split(" ")[0]}
              </h2>

              <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#C9A45C] mt-12 mb-16" />

              <p className="font-serif-premium text-[#F8E9E2] text-sm md:text-base italic z-10 tracking-wide">
                With love,<br/>
                {config.bride.name.split(" ")[0]} &amp; {config.groom.name.split(" ")[0]}
              </p>
              
              <div className="mt-16 border-t border-[#C9A45C]/20 w-full pt-6 relative z-10">
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#C9A45C]/60 font-medium">
                  Created with love by digiinvitations_
                </span>
              </div>
            </motion.section>
          </>
        )}

      </div>

      {/* 13. FLOATING BUTTONS */}
      {/* Music Floating Toggle (Bottom Right) */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group">
          <div className="relative">
            <button
              onClick={toggleMusic}
              className={`relative w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-[0_4px_15px_rgb(0,0,0,0.15)] cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 border border-[#C9A45C]/50 ${
                musicPlaying ? "bg-[#B94E2F] text-white animate-[pulse_2s_ease-in-out_infinite]" : "bg-[#FFF9F3] text-[#B94E2F]"
              }`}
              title={musicPlaying ? "Mute Background Music" : "Play Background Music"}
            >
              {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      )}

      
      
      
      {/* Scroll-to-Top Toggle (Bottom Right above Music) */}
      <AnimatePresence>
        {isOpened && showScrollTop && (
          <motion.div
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-24 right-6 z-40 group"
          >
            <div className="relative">
              <button
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="w-12 h-12 rounded-full bg-[#FFF9F3] text-[#B94E2F] font-bold flex items-center justify-center shadow-md border border-[#C9A45C]/50 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
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

      {/* End of Website Admin Button */}
      {isOpened && (
        <div className="w-full text-center pb-8 pt-4 relative z-10 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300">
          {!showAdminLogin ? (
            <button 
              onClick={() => setShowAdminLogin(true)} 
              className="text-[#C9A45C] flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors px-4 py-2 cursor-pointer"
            >
              <Settings size={12} /> Admin
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-[#FFF9F3] p-4 rounded-xl border border-[#C9A45C]/30 shadow-lg mt-2">
              <p className="text-[10px] uppercase tracking-widest text-[#B94E2F] font-bold">Admin Access</p>
              <div className="flex items-center gap-2">
                <input 
                  type="password"
                  value={adminPwd}
                  onChange={(e) => {
                    setAdminPwd(e.target.value);
                    setAdminLoginError(false);
                  }}
                  placeholder="Password"
                  className="px-3 py-1.5 text-xs rounded-md border border-[#C9A45C]/50 focus:outline-none focus:border-[#B94E2F] text-center w-24 bg-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (adminPwd === "6396") {
                        setShowAdmin(true);
                        setShowAdminLogin(false);
                        setAdminPwd("");
                      } else {
                        setAdminLoginError(true);
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (adminPwd === "6396") {
                      setShowAdmin(true);
                      setShowAdminLogin(false);
                      setAdminPwd("");
                    } else {
                      setAdminLoginError(true);
                    }
                  }}
                  className="bg-[#C9A45C] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#B94E2F] transition-colors cursor-pointer"
                >
                  Go
                </button>
                <button 
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPwd("");
                    setAdminLoginError(false);
                  }}
                  className="text-[#765E52] px-2 py-1.5 rounded-md text-xs hover:text-black transition-colors cursor-pointer"
                >
                  X
                </button>
              </div>
              {adminLoginError && <p className="text-red-500 text-[10px] m-0">Incorrect password</p>}
            </div>
          )}
        </div>
      )}

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
