import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Send,
  Calendar,
  Clock,
  MapPin,
  Heart,
  Plus,
  Trash2,
  ChevronDown,
  Sparkles,
  Music,
  Users,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  Pencil
} from "lucide-react";
import { WeddingConfig } from "../weddingConfig";

interface CeremonyEvent {
  id: string;
  eventName: string;
  date: string;
  time: string;
  venueName: string;
  venueAddress: string;
  mapDirectionsUrl: string;
}

interface EditInvitationModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onPauseMusic?: () => void;
}

export function getDayAndYear(dateStr: string): { day: string; year: string } {
  if (!dateStr) return { day: "", year: "" };
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const year = parts[0];
      const month = parseInt(parts[1], 10) - 1;
      const dayNum = parseInt(parts[2], 10);
      const d = new Date(parseInt(year, 10), month, dayNum);
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return {
        day: days[d.getDay()] || "",
        year: year,
      };
    }
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) {
      const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      return {
        day: days[d.getDay()] || "",
        year: d.getFullYear().toString(),
      };
    }
  } catch {
    // fallback
  }
  return { day: "", year: "" };
}

const CEREMONY_PRESETS = [
  "Haldi",
  "Mehndi",
  "Sangeet",
  "Ring Ceremony / Engagement",
  "Wedding Ceremony (Pheras)",
  "Reception",
  "Cocktail Party",
  "Tilak Ceremony",
];

const HELPER_CHIPS = [
  { label: "👗 Dress Code / Theme", snippet: "• Dress Code / Theme: " },
  { label: "🏷️ Wedding Hashtag", snippet: "• Wedding Hashtag: #" },
  { label: "📸 Photo Gallery Section", snippet: "• Please include a Photo Gallery section with high-res photos" },
  { label: "🎥 Live Streaming Link", snippet: "• Live Streaming YouTube/Zoom Link: " },
  { label: "💌 RSVP Form", snippet: "• Include RSVP Form with guest count collection" },
  { label: "⏳ Countdown Timer", snippet: "• Include live countdown timer to the wedding date" },
  { label: "🏨 Hotel & Stay Info", snippet: "• Accommodation / Hotel Details: " },
  { label: "🚗 Travel & Shuttle Info", snippet: "• Shuttle / Travel & Parking Instructions: " },
];

export function EditInvitationModal({
  isOpen,
  onClose,
  config,
  onPauseMusic,
}: EditInvitationModalProps) {
  // 1. Groom & Bride Details
  const [groomName, setGroomName] = useState(config.groom?.name || "");
  const [groomFather, setGroomFather] = useState(config.groom?.fatherName || "");
  const [groomMother, setGroomMother] = useState(config.groom?.motherName || "");
  const [groomBio, setGroomBio] = useState(config.groom?.bio || "");

  const [brideName, setBrideName] = useState(config.bride?.name || "");
  const [brideFather, setBrideFather] = useState(config.bride?.fatherName || "");
  const [brideMother, setBrideMother] = useState(config.bride?.motherName || "");
  const [brideBio, setBrideBio] = useState(config.bride?.bio || "");

  // 2. Wedding Information
  const initialDate = config.weddingDate?.split("T")[0] || "2026-12-12";
  const [weddingDate, setWeddingDate] = useState(initialDate);
  const [weddingTime, setWeddingTime] = useState("07:00 PM onwards");
  const [weddingVenue, setWeddingVenue] = useState(
    config.weddingEvents?.[0]?.venueName || "The Royal Heritage Palace"
  );
  const [weddingAddress, setWeddingAddress] = useState(
    config.weddingEvents?.[0]?.venueAddress || "Grand Ball Room, MG Road, New Delhi"
  );
  const [weddingMapsUrl, setWeddingMapsUrl] = useState(
    config.weddingEvents?.[0]?.mapDirectionsUrl || ""
  );

  // 3. Wedding Ceremonies
  const [events, setEvents] = useState<CeremonyEvent[]>(() => {
    if (config.weddingEvents && config.weddingEvents.length > 0) {
      return config.weddingEvents.map((ev, idx) => ({
        id: `ev-${idx}-${Date.now()}`,
        eventName: ev.eventName || "Ceremony",
        date: ev.time?.split("T")[0] || initialDate,
        time: ev.time?.includes("T") ? ev.time.split("T")[1] : "05:00 PM",
        venueName: ev.venueName || "",
        venueAddress: ev.venueAddress || "",
        mapDirectionsUrl: ev.mapDirectionsUrl || "",
      }));
    }
    return [
      {
        id: "ev-1",
        eventName: "Mehndi & Sangeet",
        date: initialDate,
        time: "04:00 PM",
        venueName: "The Royal Ballroom",
        venueAddress: "MG Road, New Delhi",
        mapDirectionsUrl: "",
      },
      {
        id: "ev-2",
        eventName: "Haldi Ceremony",
        date: initialDate,
        time: "10:00 AM",
        venueName: "Poolside Lawn",
        venueAddress: "MG Road, New Delhi",
        mapDirectionsUrl: "",
      },
    ];
  });

  // 4. Family Details (Optional)
  const [brideFamily, setBrideFamily] = useState(
    config.familyDetails?.welcomingText || ""
  );
  const [groomFamily, setGroomFamily] = useState(
    config.familyDetails?.names?.join(", ") || ""
  );

  // 5. Invitation Message (Optional)
  const [invitationMessage, setInvitationMessage] = useState(
    config.heroSettings?.introText ||
      "With the blessings of the Almighty & our respected elders, we joyfully request your gracious presence on our wedding celebration."
  );

  // 6. Background Music (Optional)
  const [musicLink, setMusicLink] = useState(config.musicUrl || "");

  // 7. Specific Details / Custom features / Helper chips
  const [specificDetails, setSpecificDetails] = useState("");

  // Accordion state
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    couple: true,
    weddingInfo: true,
    ceremonies: true,
    family: false,
    message: false,
    music: false,
    specialRequests: true,
  });

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Auto calculated day & year for main wedding date
  const { day: weddingDay, year: weddingYear } = getDayAndYear(weddingDate);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleAddPresetCeremony = (presetName: string) => {
    setEvents((prev) => [
      ...prev,
      {
        id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        eventName: presetName,
        date: weddingDate || initialDate,
        time: "06:00 PM",
        venueName: weddingVenue || "",
        venueAddress: weddingAddress || "",
        mapDirectionsUrl: "",
      },
    ]);
  };

  const handleRemoveCeremony = (id: string) => {
    setEvents((prev) => prev.filter((ev) => ev.id !== id));
  };

  const handleUpdateCeremony = (id: string, field: keyof CeremonyEvent, value: string) => {
    setEvents((prev) =>
      prev.map((ev) => (ev.id === id ? { ...ev, [field]: value } : ev))
    );
  };

  const handleChipClick = (snippet: string) => {
    setSpecificDetails((prev) => {
      const cleanPrev = prev.trim();
      if (!cleanPrev) return snippet;
      if (cleanPrev.includes(snippet.trim())) return prev;
      return `${cleanPrev}\n${snippet}`;
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!groomName.trim()) newErrors.groomName = "Groom's full name is required";
    if (!brideName.trim()) newErrors.brideName = "Bride's full name is required";
    if (!weddingDate) newErrors.weddingDate = "Wedding date is required";
    if (!weddingVenue.trim()) newErrors.weddingVenue = "Wedding venue name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendWhatsApp = () => {
    if (!validateForm()) {
      setExpandedSections((prev) => ({
        ...prev,
        couple: true,
        weddingInfo: true,
      }));
      return;
    }

    if (onPauseMusic) {
      onPauseMusic();
    }

    const currentUrl = window.location.href;

    // Build the formatted WhatsApp message
    let msg = `💍 *WEDDING INVITATION CUSTOMIZATION DETAILS*\n`;
    msg += `━━━━━━━━━━━━━━━━━━━━━\n\n`;

    msg += `🌐 *Selected Template URL:*\n${currentUrl}\n\n`;

    msg += `👰 *BRIDE DETAILS*\n`;
    msg += `• Full Name: ${brideName.trim()}\n`;
    if (brideFather.trim()) msg += `• Father's Name: ${brideFather.trim()}\n`;
    if (brideMother.trim()) msg += `• Mother's Name: ${brideMother.trim()}\n`;
    if (brideBio.trim()) msg += `• Introduction: ${brideBio.trim()}\n`;
    msg += `\n`;

    msg += `🤵 *GROOM DETAILS*\n`;
    msg += `• Full Name: ${groomName.trim()}\n`;
    if (groomFather.trim()) msg += `• Father's Name: ${groomFather.trim()}\n`;
    if (groomMother.trim()) msg += `• Mother's Name: ${groomMother.trim()}\n`;
    if (groomBio.trim()) msg += `• Introduction: ${groomBio.trim()}\n`;
    msg += `\n`;

    msg += `📅 *MAIN WEDDING CELEBRATION*\n`;
    msg += `• Date: ${weddingDate} (${weddingDay || "Day"}, ${weddingYear || "Year"})\n`;
    if (weddingTime.trim()) msg += `• Time: ${weddingTime.trim()}\n`;
    msg += `• Venue: ${weddingVenue.trim()}\n`;
    if (weddingAddress.trim()) msg += `• Full Address: ${weddingAddress.trim()}\n`;
    if (weddingMapsUrl.trim()) msg += `• Google Maps: ${weddingMapsUrl.trim()}\n`;
    msg += `\n`;

    if (events.length > 0) {
      msg += `🎉 *WEDDING CEREMONIES (${events.length})*\n`;
      events.forEach((ev, idx) => {
        const { day: evDay } = getDayAndYear(ev.date);
        msg += `${idx + 1}. *${ev.eventName}*\n`;
        msg += `   • Date & Day: ${ev.date} ${evDay ? `(${evDay})` : ""}\n`;
        if (ev.time) msg += `   • Time: ${ev.time}\n`;
        if (ev.venueName) msg += `   • Venue: ${ev.venueName}\n`;
        if (ev.venueAddress) msg += `   • Address: ${ev.venueAddress}\n`;
        if (ev.mapDirectionsUrl) msg += `   • Maps Link: ${ev.mapDirectionsUrl}\n`;
      });
      msg += `\n`;
    }

    if (brideFamily.trim() || groomFamily.trim()) {
      msg += `👨‍👩‍👧‍👦 *FAMILY DETAILS*\n`;
      if (brideFamily.trim()) msg += `• Bride's Side: ${brideFamily.trim()}\n`;
      if (groomFamily.trim()) msg += `• Groom's Side: ${groomFamily.trim()}\n`;
      msg += `\n`;
    }

    if (invitationMessage.trim()) {
      msg += `💌 *INVITATION MESSAGE / SHLOKA*\n`;
      msg += `"${invitationMessage.trim()}"\n\n`;
    }

    if (musicLink.trim()) {
      msg += `🎵 *BACKGROUND MUSIC PREFERENCE*\n`;
      msg += `${musicLink.trim()}\n\n`;
    }

    if (specificDetails.trim()) {
      msg += `✨ *SPECIFIC DETAILS & SPECIAL REQUESTS*\n`;
      msg += `${specificDetails.trim()}\n\n`;
    }

    msg += `━━━━━━━━━━━━━━━━━━━━━\n`;
    msg += `_Sent via Wedding E-Card Portal_`;

    const targetPhone = "919456411569";
    const waUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(msg)}`;

    window.open(waUrl, "_blank");

    try {
      navigator.clipboard?.writeText(msg);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 4000);
    } catch {
      // ignore
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-0"
        />

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10 w-full max-w-2xl bg-[#FFF9F3] border border-[#C9A45C]/50 rounded-3xl shadow-[0_20px_60px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col max-h-[90vh] my-auto text-[#4B3A35] font-serif-premium"
        >
          {/* Header */}
          <div className="relative px-6 py-5 bg-gradient-to-r from-[#641D2E] via-[#85253C] to-[#641D2E] text-white shrink-0 flex items-center justify-between border-b border-[#C9A45C]/40">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#dec47f]/20 border border-[#dec47f]/50 flex items-center justify-center text-[#dec47f] shadow-inner">
                <Pencil size={18} />
              </div>
              <div>
                <h2 className="font-accent text-2xl sm:text-3xl text-[#dec47f] leading-none tracking-wide">
                  Edit Your Invitation
                </h2>
                <p className="font-sans text-[11px] text-[#dec47f]/80 tracking-wider uppercase mt-1">
                  Fill details &amp; send on WhatsApp
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer border border-white/20"
              title="Close"
            >
              <X size={18} />
            </button>
          </div>

          {/* Scrollable Form Content */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-6 space-y-5 bg-[#FFF9F3]">
            {copiedNotification && (
              <div className="bg-emerald-50 border border-emerald-300 text-emerald-800 px-4 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Details prepared! Opening WhatsApp now...</span>
              </div>
            )}

            {Object.keys(errors).length > 0 && (
              <div className="bg-rose-50 border border-rose-300 text-rose-800 px-4 py-3 rounded-xl text-xs sm:text-sm flex items-start gap-2">
                <AlertCircle size={18} className="text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold font-sans">Please fill in the required fields:</p>
                  <ul className="list-disc list-inside mt-1 space-y-0.5 text-xs">
                    {Object.values(errors).map((err, i) => (
                      <li key={i}>{err}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {/* SECTION 1: BRIDE & GROOM DETAILS */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("couple")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Heart size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    1. Bride &amp; Groom Details
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.couple ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.couple && (
                <div className="p-5 space-y-6 border-t border-[#C9A45C]/20 bg-white/40">
                  {/* Groom Section */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 border-b border-[#C9A45C]/30 pb-1.5">
                      <span className="text-base">🤵</span>
                      <h4 className="font-sans font-semibold text-xs text-[#B94E2F] uppercase tracking-wider">
                        Groom's Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={groomName}
                          onChange={(e) => {
                            setGroomName(e.target.value);
                            if (errors.groomName) setErrors((prev) => ({ ...prev, groomName: "" }));
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className={`w-full px-3.5 py-2 text-sm bg-white border ${
                            errors.groomName ? "border-red-400 focus:ring-red-200" : "border-[#C9A45C]/40"
                          } rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          value={groomFather}
                          onChange={(e) => setGroomFather(e.target.value)}
                          placeholder="e.g. Mr. Rajesh Sharma"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          value={groomMother}
                          onChange={(e) => setGroomMother(e.target.value)}
                          placeholder="e.g. Mrs. Sunita Sharma"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Short Introduction (2–4 lines)
                        </label>
                        <textarea
                          rows={2}
                          value={groomBio}
                          onChange={(e) => setGroomBio(e.target.value)}
                          placeholder="e.g. Software Engineer based in Bengaluru, music lover..."
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Bride Section */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center gap-2 border-b border-[#C9A45C]/30 pb-1.5">
                      <span className="text-base">👰</span>
                      <h4 className="font-sans font-semibold text-xs text-[#B94E2F] uppercase tracking-wider">
                        Bride's Information
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={brideName}
                          onChange={(e) => {
                            setBrideName(e.target.value);
                            if (errors.brideName) setErrors((prev) => ({ ...prev, brideName: "" }));
                          }}
                          placeholder="e.g. Ananya Verma"
                          className={`w-full px-3.5 py-2 text-sm bg-white border ${
                            errors.brideName ? "border-red-400 focus:ring-red-200" : "border-[#C9A45C]/40"
                          } rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all`}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Father's Name
                        </label>
                        <input
                          type="text"
                          value={brideFather}
                          onChange={(e) => setBrideFather(e.target.value)}
                          placeholder="e.g. Mr. Anil Verma"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Mother's Name
                        </label>
                        <input
                          type="text"
                          value={brideMother}
                          onChange={(e) => setBrideMother(e.target.value)}
                          placeholder="e.g. Mrs. Priya Verma"
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                          Short Introduction (2–4 lines)
                        </label>
                        <textarea
                          rows={2}
                          value={brideBio}
                          onChange={(e) => setBrideBio(e.target.value)}
                          placeholder="e.g. Architect, classical dancer, coffee enthusiast..."
                          className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all resize-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 2: WEDDING INFORMATION */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("weddingInfo")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Calendar size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    2. Wedding Information
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.weddingInfo ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.weddingInfo && (
                <div className="p-5 space-y-4 border-t border-[#C9A45C]/20 bg-white/40">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                        Wedding Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        value={weddingDate}
                        onChange={(e) => {
                          setWeddingDate(e.target.value);
                          if (errors.weddingDate) setErrors((prev) => ({ ...prev, weddingDate: "" }));
                        }}
                        className={`w-full px-3.5 py-2 text-sm bg-white border ${
                          errors.weddingDate ? "border-red-400" : "border-[#C9A45C]/40"
                        } rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all`}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                        Calculated Day (Auto)
                      </label>
                      <div className="w-full px-3.5 py-2 text-sm bg-[#FFF8F3] border border-[#C9A45C]/30 rounded-xl text-[#B94E2F] font-semibold flex items-center gap-2">
                        <Calendar size={14} className="text-[#C9A45C]" />
                        {weddingDay || "Select date"}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                        Wedding Year (Auto)
                      </label>
                      <div className="w-full px-3.5 py-2 text-sm bg-[#FFF8F3] border border-[#C9A45C]/30 rounded-xl text-[#B94E2F] font-semibold">
                        {weddingYear || "----"}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                        Wedding Time
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={weddingTime}
                          onChange={(e) => setWeddingTime(e.target.value)}
                          placeholder="e.g. 07:00 PM onwards"
                          className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                        />
                        <Clock size={15} className="absolute left-3 top-2.5 text-[#C9A45C]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                        Wedding Venue Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={weddingVenue}
                        onChange={(e) => {
                          setWeddingVenue(e.target.value);
                          if (errors.weddingVenue) setErrors((prev) => ({ ...prev, weddingVenue: "" }));
                        }}
                        placeholder="e.g. The Grand Palace"
                        className={`w-full px-3.5 py-2 text-sm bg-white border ${
                          errors.weddingVenue ? "border-red-400" : "border-[#C9A45C]/40"
                        } rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                      Full Venue Address
                    </label>
                    <input
                      type="text"
                      value={weddingAddress}
                      onChange={(e) => setWeddingAddress(e.target.value)}
                      placeholder="e.g. Plot No 12, Heritage Boulevard, Civil Lines, Jaipur"
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                      Google Maps Link
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        value={weddingMapsUrl}
                        onChange={(e) => setWeddingMapsUrl(e.target.value)}
                        placeholder="https://maps.app.goo.gl/..."
                        className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                      />
                      <MapPin size={15} className="absolute left-3 top-2.5 text-[#C9A45C]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: WEDDING CEREMONIES */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("ceremonies")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    3. Wedding Ceremonies ({events.length})
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.ceremonies ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.ceremonies && (
                <div className="p-5 space-y-4 border-t border-[#C9A45C]/20 bg-white/40">
                  <div>
                    <p className="text-xs font-sans font-medium text-[#765E52] mb-2">
                      Quick Add Ceremonies:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {CEREMONY_PRESETS.map((preset) => (
                        <button
                          key={preset}
                          type="button"
                          onClick={() => handleAddPresetCeremony(preset)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-white border border-[#C9A45C]/50 text-[#84571f] rounded-full hover:bg-[#dec47f]/20 hover:border-[#84571f] transition-all cursor-pointer font-sans"
                        >
                          <Plus size={12} />
                          {preset}
                        </button>
                      ))}
                      <button
                        type="button"
                        onClick={() => handleAddPresetCeremony("Custom Ceremony")}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs bg-[#B94E2F] text-white rounded-full hover:bg-[#8F3B22] transition-all cursor-pointer font-sans font-medium shadow-sm"
                      >
                        <Plus size={12} />
                        Custom Event
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3.5 pt-2">
                    {events.map((ev, index) => {
                      const { day: evDay } = getDayAndYear(ev.date);
                      return (
                        <div
                          key={ev.id}
                          className="bg-white p-4 rounded-xl border border-[#C9A45C]/40 shadow-sm space-y-3 relative"
                        >
                          <div className="flex items-center justify-between border-b border-[#C9A45C]/20 pb-2">
                            <span className="font-sans font-bold text-xs text-[#B94E2F] uppercase tracking-wider">
                              Event #{index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCeremony(ev.id)}
                              className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50 transition-colors cursor-pointer"
                              title="Remove Event"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                Event Name
                              </label>
                              <input
                                type="text"
                                value={ev.eventName}
                                onChange={(e) =>
                                  handleUpdateCeremony(ev.id, "eventName", e.target.value)
                                }
                                placeholder="e.g. Sangeet Night"
                                className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                  Date
                                </label>
                                <input
                                  type="date"
                                  value={ev.date}
                                  onChange={(e) =>
                                    handleUpdateCeremony(ev.id, "date", e.target.value)
                                  }
                                  className="w-full px-2 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                                />
                              </div>
                              <div>
                                <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                  Day (Auto)
                                </label>
                                <div className="w-full px-2 py-1.5 text-xs bg-[#FFF8F3] border border-[#C9A45C]/30 rounded-lg text-[#B94E2F] font-semibold text-center truncate">
                                  {evDay || "Select date"}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                Time
                              </label>
                              <input
                                type="text"
                                value={ev.time}
                                onChange={(e) =>
                                  handleUpdateCeremony(ev.id, "time", e.target.value)
                                }
                                placeholder="e.g. 05:00 PM"
                                className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                Venue Name
                              </label>
                              <input
                                type="text"
                                value={ev.venueName}
                                onChange={(e) =>
                                  handleUpdateCeremony(ev.id, "venueName", e.target.value)
                                }
                                placeholder="e.g. Lawn 1, Heritage Resort"
                                className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                Full Address
                              </label>
                              <input
                                type="text"
                                value={ev.venueAddress}
                                onChange={(e) =>
                                  handleUpdateCeremony(ev.id, "venueAddress", e.target.value)
                                }
                                placeholder="e.g. NH-8, Near Airport"
                                className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div>
                              <label className="block text-[11px] font-sans font-medium text-[#765E52] mb-1">
                                Google Maps Link
                              </label>
                              <input
                                type="url"
                                value={ev.mapDirectionsUrl}
                                onChange={(e) =>
                                  handleUpdateCeremony(ev.id, "mapDirectionsUrl", e.target.value)
                                }
                                placeholder="https://maps.app.goo.gl/..."
                                className="w-full px-3 py-1.5 text-xs bg-[#FFFDF9] border border-[#C9A45C]/40 rounded-lg focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 4: FAMILY DETAILS (OPTIONAL) */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("family")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Users size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    4. Family Details{" "}
                    <span className="text-[11px] text-[#765E52] font-normal lowercase">
                      (optional)
                    </span>
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.family ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.family && (
                <div className="p-5 space-y-3 border-t border-[#C9A45C]/20 bg-white/40">
                  <div>
                    <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                      Bride's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={brideFamily}
                      onChange={(e) => setBrideFamily(e.target.value)}
                      placeholder="e.g. Verma Family, Grandparents, Uncles, Aunts..."
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all resize-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                      Groom's Side Family Names
                    </label>
                    <textarea
                      rows={2}
                      value={groomFamily}
                      onChange={(e) => setGroomFamily(e.target.value)}
                      placeholder="e.g. Sharma Family, With best compliments from..."
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all resize-none"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 5: INVITATION MESSAGE (OPTIONAL) */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("message")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <MessageSquare size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    5. Invitation Message{" "}
                    <span className="text-[11px] text-[#765E52] font-normal lowercase">
                      (optional)
                    </span>
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.message ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.message && (
                <div className="p-5 space-y-3 border-t border-[#C9A45C]/20 bg-white/40">
                  <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                    Custom Invitation Text / Shloka / Note
                  </label>
                  <textarea
                    rows={3}
                    value={invitationMessage}
                    onChange={(e) => setInvitationMessage(e.target.value)}
                    placeholder="Enter your preferred invitation message or blessing..."
                    className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                  />
                </div>
              )}
            </div>

            {/* SECTION 6: BACKGROUND MUSIC (OPTIONAL) */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("music")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Music size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    6. Background Music{" "}
                    <span className="text-[11px] text-[#765E52] font-normal lowercase">
                      (optional)
                    </span>
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.music ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.music && (
                <div className="p-5 space-y-3 border-t border-[#C9A45C]/20 bg-white/40">
                  <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                    YouTube Link or Preferred Song Title
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={musicLink}
                      onChange={(e) => setMusicLink(e.target.value)}
                      placeholder="e.g. https://www.youtube.com/watch?v=... or Din Shagna Da"
                      className="w-full pl-9 pr-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                    />
                    <Music size={15} className="absolute left-3 top-2.5 text-[#C9A45C]" />
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 7: SPECIFIC DETAILS / CUSTOM REQUESTS / HELPER CHIPS */}
            <div className="bg-white/80 rounded-2xl border border-[#C9A45C]/30 shadow-sm overflow-hidden">
              <button
                type="button"
                onClick={() => toggleSection("specialRequests")}
                className="w-full px-5 py-4 flex items-center justify-between text-left bg-gradient-to-r from-[#dec47f]/10 to-transparent hover:bg-[#dec47f]/20 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles size={18} className="text-[#B94E2F]" />
                  <span className="font-sans font-bold text-sm tracking-wide text-[#641D2E] uppercase">
                    7. Specific Details &amp; Custom Features{" "}
                    <span className="text-[11px] text-[#765E52] font-normal lowercase">
                      (optional)
                    </span>
                  </span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[#B94E2F] transition-transform duration-200 ${
                    expandedSections.specialRequests ? "rotate-180" : ""
                  }`}
                />
              </button>

              {expandedSections.specialRequests && (
                <div className="p-5 space-y-3.5 border-t border-[#C9A45C]/20 bg-white/40">
                  <div>
                    <p className="text-xs font-sans font-medium text-[#765E52] mb-1.5">
                      Tap quick-insert chips to add common client features:
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {HELPER_CHIPS.map((chip, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleChipClick(chip.snippet)}
                          className="px-2.5 py-1 text-xs bg-white border border-[#C9A45C]/50 text-[#84571f] rounded-full hover:bg-[#dec47f]/20 hover:border-[#84571f] transition-all cursor-pointer font-sans shadow-xs"
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-sans font-medium text-[#765E52] mb-1">
                      Any specific changes, extra features or color theme requests:
                    </label>
                    <textarea
                      rows={3}
                      value={specificDetails}
                      onChange={(e) => setSpecificDetails(e.target.value)}
                      placeholder="Add custom notes, theme preferences, hotel details, hashtag, or specific sections you want..."
                      className="w-full px-3.5 py-2 text-sm bg-white border border-[#C9A45C]/40 rounded-xl focus:outline-none focus:border-[#B94E2F] transition-all"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer with WhatsApp Redirection Button */}
          <div className="px-6 py-4 bg-white/95 border-t border-[#C9A45C]/30 shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-lg">
            <div className="text-center sm:text-left">
              <span className="text-xs text-[#765E52] block font-sans">
                Review on WhatsApp &amp; message directly:
              </span>
              <span className="text-xs font-bold text-[#B94E2F] font-sans">
                WhatsApp: +91 9456411569
              </span>
            </div>

            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="w-full sm:w-auto px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-full font-sans font-bold text-sm tracking-wide shadow-[0_4px_16px_rgba(37,211,102,0.4)] flex items-center justify-center gap-2.5 transition-all transform active:scale-95 cursor-pointer"
            >
              <Send size={16} />
              <span>Send Details on Whatsapp</span>
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
