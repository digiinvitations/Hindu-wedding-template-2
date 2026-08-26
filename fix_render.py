import sys

with open('src/components/AdminPanel.tsx', 'r') as f:
    code = f.read()

start_index = code.find('return (')
if start_index == -1:
    print("Could not find return (")
    sys.exit(1)

before = code[:start_index]

new_return = """return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          key="admin-panel-root"
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden"
        >
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
              <button
                onClick={onClose}
                className="text-[#765E52] hover:text-[#B94E2F] hover:bg-[#B94E2F]/10 p-2 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col md:flex-row flex-1 min-h-0 overflow-hidden bg-white">
              {/* Sidebar Tabs */}
              <div className="flex md:flex-col gap-2 p-4 border-b md:border-b-0 md:border-r border-[#C9A45C]/20 bg-[#FFF9F3]/30 overflow-x-auto md:overflow-y-auto md:w-56 shrink-0 no-scrollbar">
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
                {/* HERO TAB */}
                {activeTab === "hero" && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 pb-6">
                    <div className="bg-[#FFF9F3]/50 p-5 rounded-2xl border border-[#C9A45C]/20 space-y-5">
                      <h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest border-b border-[#C9A45C]/20 pb-3">
                        Hero Customization
                      </h4>
                      
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
                              time: "Date & Time",
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
                              <label className="block text-[10px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wider">Date & Time</label>
                              <input 
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
                      {(!editConfig.weddingEvents || len(editConfig.weddingEvents) == 0) && (
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
"""

new_return = new_return.replace('len(editConfig.weddingEvents) == 0', 'editConfig.weddingEvents.length === 0')

with open('src/components/AdminPanel.tsx', 'w') as f:
    f.write(before + new_return)

print("Updated via python")
