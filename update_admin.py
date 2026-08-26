import re

with open("src/components/AdminPanel.tsx", "r") as f:
    code = f.read()

# 1. Update activeTab state type
code = code.replace(
    'useState<"hero" | "save_the_date" | "events" | "assets">("hero")',
    'useState<"cover" | "hero" | "save_the_date" | "events" | "assets">("hero")'
)

# 2. Add Cover button to sidebar tabs
button_str = """<button onClick={() => setActiveTab("cover")} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors shrink-0 ${activeTab === "cover" ? "bg-[#B94E2F] text-white shadow-md" : "text-[#765E52] hover:bg-[#B94E2F]/10"}`}> 
                  <ImageIcon size={18} /> Cover & Music
                </button>
                <button onClick={() => setActiveTab("hero")}"""
code = code.replace('<button onClick={() => setActiveTab("hero")}', button_str)

# 3. Add Cover tab content
cover_content = """{/* COVER TAB */}
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

                {/* HERO TAB */}"""

code = code.replace('{/* HERO TAB */}', cover_content)

# 4. Modify Events section 
# Replace "+ Add Event" logic to use "date" instead of "time" if we want, or keep it as time but input date.
add_event_str = """newEvents.push({
                              eventName: "New Event",
                              time: "",
                              venueName: "Venue Name",
                              venueAddress: "Venue Address","""

code = code.replace("""newEvents.push({
                              eventName: "New Event",
                              time: "Date & Time",
                              venueName: "Venue Name",
                              venueAddress: "Venue Address",""", add_event_str)

# 5. Modify Date input to use type="date"
date_input_str = """<div>
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
                            </div>"""

code = re.sub(
    r'<div>\s*<label className="block text-\[10px\] font-semibold text-\[#765E52\] mb-1\.5 uppercase tracking-wider">Date & Time</label>\s*<input \s*value=\{event\.time\}\s*onChange=\{e => \{\s*const newEvents = \[\.\.\.editConfig\.weddingEvents\];\s*newEvents\[index\]\.time = e\.target\.value;\s*setEditConfig\(c => \(\{\.\.\.c, weddingEvents: newEvents\}\)\);\s*\}\}\s*className="[^"]*"\s*/>\s*</div>',
    date_input_str,
    code,
    flags=re.DOTALL
)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(code)

print("Updated AdminPanel.tsx")
