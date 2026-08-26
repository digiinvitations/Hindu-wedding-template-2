import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, Image as ImageIcon, Calendar, Settings, Database, Map, CheckCircle2, Download, Upload } from "lucide-react";
import { Loader2 } from "lucide-react";
import { WeddingConfig } from "../weddingConfig";
import { AssetManager } from "./AssetManager";

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: WeddingConfig;
  onConfigChange: (newConfig: WeddingConfig) => Promise<void>;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, config, onConfigChange }) => {
  const [activeTab, setActiveTab] = useState<"cover" | "hero" | "save_the_date" | "events" | "assets">("hero");
  const [editConfig, setEditConfig] = useState<WeddingConfig>(config);
  const [showToast, setShowToast] = useState(false);

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setEditConfig(config);
    }
  }, [isOpen]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = JSON.stringify(editConfig, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "wedding_config_backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const processImportFile = (file: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const importedData = JSON.parse(event.target?.result as string);
        setEditConfig(importedData);
        alert("Data imported successfully! Please click 'Save Changes' to apply permanently.");
      } catch (err) {
        alert("Invalid file format. Please upload a valid JSON config file.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processImportFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processImportFile(e.dataTransfer.files[0]);
    }
  };

  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onConfigChange(editConfig);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      // Error is alerted by parent
    } finally {
      setIsSaving(false);
    }
  };


  

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="admin-panel-root"
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {isDragging && (
            <div className="absolute inset-0 z-[110] bg-[#C9A45C]/90 backdrop-blur-sm flex flex-col items-center justify-center text-white border-4 border-dashed border-white m-4 rounded-[2rem]">
              <Upload size={64} className="mb-4" />
              <h2 className="text-3xl font-display font-bold">Drop JSON config file here</h2>
              <p className="mt-2 text-white/80">The data will be imported immediately</p>
            </div>
          )}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-4xl bg-white border border-[#C9A45C]/30 rounded-[2rem] shadow-2xl z-10 max-h-[90vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#C9A45C]/20 bg-[#FFF9F3] shrink-0">
              <div>
                <h3 className="font-display text-xl text-[#B94E2F] flex items-center gap-2 font-bold">
                  <Settings size={22} className="text-[#C9A45C]" /> Invitation Settings
                </h3>
                <p className="text-[10px] text-[#765E52] uppercase tracking-widest mt-1">
                  Manage Content & Details
                </p>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="file" 
                  accept=".json" 
                  ref={fileInputRef} 
                  onChange={handleImportFile} 
                  className="hidden" 
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Import Data"
                  className="bg-[#FFF9F3] border border-[#C9A45C]/50 hover:bg-[#F5EDD6] text-[#B94E2F] px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  <Upload size={16} /> <span className="hidden md:inline">Import</span>
                </button>
                <button
                  onClick={handleExport}
                  title="Export Data"
                  className="bg-[#FFF9F3] border border-[#C9A45C]/50 hover:bg-[#F5EDD6] text-[#B94E2F] px-3 py-2 rounded-xl text-sm font-bold shadow-sm transition-all active:scale-95 flex items-center gap-2"
                >
                  <Download size={16} /> <span className="hidden md:inline">Export</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="bg-[#B94E2F] hover:bg-[#8F3B22] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}
                </button>
                <button
                  onClick={onClose}
                  className="text-[#765E52] hover:text-[#B94E2F] hover:bg-[#B94E2F]/10 p-2 rounded-full cursor-pointer transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden bg-white">
              {/* Sidebar Tabs */}
              <div className="flex md:flex-col gap-2 p-4 border-b md:border-b-0 md:border-r border-[#C9A45C]/20 bg-[#FFF9F3]/30 overflow-x-auto md:overflow-y-auto md:w-56 shrink-0 no-scrollbar">
                <button onClick={() => setActiveTab("cover")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "cover" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <ImageIcon size={18} /> Cover & Music
                </button>
                <button onClick={() => setActiveTab("hero")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "hero" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <ImageIcon size={18} /> Hero Section 
                </button>
                <button onClick={() => setActiveTab("save_the_date")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "save_the_date" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <Calendar size={18} /> Save The Date 
                </button>
                <button onClick={() => setActiveTab("events")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "events" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <Map size={18} /> Events 
                </button>
                <button onClick={() => setActiveTab("assets")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "assets" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <Database size={18} /> Asset Manager 
                </button>
              </div>

              {/* Content Area */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar-thin bg-white">
                {/* COVER TAB */}
                {activeTab === "cover" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                    <div className="bg-[#FFF9F3]/50 p-5 rounded-2xl border border-[#C9A45C]/20 space-y-5">
                      <h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest border-b border-[#C9A45C]/20 pb-3">
                        Opening Page & Music
                      </h4>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Opening Page Thumbnail (Image)</label>
                        <input 
                          type="text" 
                          value={editConfig.openingBackgroundImageUrl || ''}
                          onChange={e => setEditConfig(c => ({...c, openingBackgroundImageUrl: e.target.value}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Opening Page Video URL</label>
                        <input 
                          type="text" 
                          value={editConfig.openingVideoUrl || ''}
                          onChange={e => setEditConfig(c => ({...c, openingVideoUrl: e.target.value}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                          placeholder="Video will play behind the envelope"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Background Music URL (Auto-plays after opening)</label>
                        <input 
                          type="text" 
                          value={editConfig.musicUrl || ''}
                          onChange={e => setEditConfig(c => ({...c, musicUrl: e.target.value}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* HERO TAB */}
                {activeTab === "hero" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                    <div className="bg-[#FFF9F3]/50 p-5 rounded-2xl border border-[#C9A45C]/20 space-y-5">
                      <h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest border-b border-[#C9A45C]/20 pb-3">
                        Hero Customization
                      </h4>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Bride Name</label>
                        <input 
                          type="text" 
                          value={editConfig.bride?.name || ''}
                          onChange={e => setEditConfig(c => ({...c, bride: {...c.bride, name: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Groom Name</label>
                        <input 
                          type="text" 
                          value={editConfig.groom?.name || ''}
                          onChange={e => setEditConfig(c => ({...c, groom: {...c.groom, name: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>

                      
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Introductory Text</label>
                        <textarea 
                          value={editConfig.heroSettings?.introText || ''}
                          onChange={e => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, introText: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F] h-24"
                          placeholder="With the blessings of the Almighty..."
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Background Video URL (Constant Playing)</label>
                        <input 
                          type="text" 
                          value={editConfig.heroSettings?.bgVideoUrl || ''}
                          onChange={e => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, bgVideoUrl: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                          placeholder="https://example.com/video.mp4"
                        />
                        <p className="text-[10px] text-[#765E52] mt-1">If provided, this replaces the textured floral background with a looping video.</p>
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Custom Top Icon Image</label>
                        <input 
                          type="text" 
                          value={editConfig.heroSettings?.ganeshaIconUrl || ''}
                          onChange={e => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, ganeshaIconUrl: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                          placeholder="https://example.com/icon.png"
                        />
                        <p className="text-[10px] text-[#765E52] mt-1">Use an image with a removed/transparent background. Replaces the default Ganesha vector.</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Groom Parents Info</label>
                          <input 
                            type="text" 
                            value={editConfig.heroSettings?.groomParents || ''}
                            onChange={e => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, groomParents: e.target.value}}))}
                            className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Bride Parents Info</label>
                          <input 
                            type="text" 
                            value={editConfig.heroSettings?.brideParents || ''}
                            onChange={e => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, brideParents: e.target.value}}))}
                            className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pt-2">
                        <input
                          type="checkbox"
                          checked={editConfig.heroSettings?.showPetals ?? true}
                          onChange={(e) => setEditConfig(c => ({...c, heroSettings: {...c.heroSettings, showPetals: e.target.checked}}))}
                          className="w-4 h-4 rounded text-[#B94E2F] focus:ring-[#B94E2F]"
                          id="showPetals"
                        />
                        <label htmlFor="showPetals" className="text-sm font-semibold text-[#765E52]">Show Falling Petals globally</label>
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* SAVE THE DATE TAB */}
                {activeTab === "save_the_date" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                    <div className="bg-[#FFF9F3]/50 p-5 rounded-2xl border border-[#C9A45C]/20 space-y-5">
                      <h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest border-b border-[#C9A45C]/20 pb-3">
                        Countdown & Date
                      </h4>
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Wedding Target Date & Time</label>
                        <input 
                          type="datetime-local" 
                          value={editConfig.weddingDate.substring(0, 16)}
                          onChange={e => setEditConfig(c => ({...c, weddingDate: e.target.value}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                        <p className="text-[10px] text-[#765E52] mt-1">This date controls the automatic countdown after scratching the hearts.</p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* EVENTS TAB */}
                {activeTab === "events" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                    <div className="bg-[#FFF9F3]/50 p-5 rounded-2xl border border-[#C9A45C]/20 space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest">
                          Sacred Ceremonies
                        </h4>
                        <button
                          onClick={() => {
                            const newEvents = [...(editConfig.weddingEvents || [])];
                            newEvents.push({
                              eventName: "New Event",
                              time: "",
                              venueName: "Venue Name",
                              venueAddress: "Venue Address",
                              mapEmbedUrl: "",
                              mapDirectionsUrl: "",
                              thumbnailUrl: ""
                            });
                            setEditConfig(c => ({...c, weddingEvents: newEvents}));
                          }}
                          className="bg-[#B94E2F] hover:bg-[#8F3B22] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md transition-colors"
                        >
                          + Add Event
                        </button>
                      </div>

                      {editConfig.weddingEvents?.map((event, index) => (
                        <div key={index} className="bg-white border border-[#C9A45C]/30 p-5 rounded-2xl relative shadow-sm">
                          <button
                            onClick={() => {
                              const newEvents = [...editConfig.weddingEvents];
                              newEvents.splice(index, 1);
                              setEditConfig(c => ({...c, weddingEvents: newEvents}));
                            }}
                            className="absolute top-4 right-4 text-red-400 hover:text-red-600 p-1 bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-2">
                            <div>
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Event Name</label>
                              <input 
                                value={event.eventName} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].eventName = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Date</label>
                              <input 
                                type="date"
                                value={event.time} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].time = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Media URL (Video MP4/WEBM or Image)</label>
                              <input 
                                value={event.thumbnailUrl || ''} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].thumbnailUrl = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                placeholder="https://... video.mp4"
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Venue Details</label>
                              <input 
                                value={event.venueName} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].venueName = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                placeholder="Venue Name"
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F] mb-3"
                              />
                              <input 
                                value={event.venueAddress} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].venueAddress = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                placeholder="Address"
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Map Link (View on Maps button)</label>
                              <input 
                                value={event.mapDirectionsUrl || ''} 
                                onChange={e => {
                                  const newEvents = [...editConfig.weddingEvents];
                                  newEvents[index].mapDirectionsUrl = e.target.value;
                                  setEditConfig(c => ({...c, weddingEvents: newEvents}));
                                }}
                                placeholder="https://maps.google.com/..."
                                className="w-full bg-[#FFF9F3]/50 border border-[#C9A45C]/30 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-[#B94E2F]"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                      {(!editConfig.weddingEvents || editConfig.weddingEvents.length === 0) && (
                        <div className="text-center p-8 bg-white/50 rounded-2xl border-2 border-dashed border-[#C9A45C]/40 text-[#765E52] text-sm">
                          No events added yet. Click "+ Add Event" to get started.
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* ASSETS TAB */}
                {activeTab === "assets" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col pb-6">
                    <AssetManager />
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            key="toast"
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#641D2E] text-white px-6 py-3 rounded-full font-bold shadow-2xl flex items-center gap-2 border border-[#C9A45C]/30"
          >
            <CheckCircle2 size={18} className="text-[#C9A45C]" />
            Changes Saved Successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </AnimatePresence>
  );
};
