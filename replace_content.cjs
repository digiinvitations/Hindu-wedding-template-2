const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const startTag = '<div className={`${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-1000 relative z-10`}>';
// We want to replace from startTag to the end of the div that closes it, which is right before `{/* 13. FLOATING BUTTONS */}`
const endTag = '{/* 13. FLOATING BUTTONS */}';

const startIndex = code.indexOf(startTag);
const endIndex = code.indexOf(endTag);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  
  const newContent = `
      <div className={\`\${isOpened ? "opacity-100" : "opacity-0 pointer-events-none"} transition-opacity duration-1000 relative z-10 bg-[#FFF9F3] text-[#4B3A35] font-serif-premium\`}>
        
        {/* Subtle Paper Texture SVG Filter */}
        <div className="fixed inset-0 opacity-[0.25] pointer-events-none z-0" style={{ backgroundImage: "url(\\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\\")" }}></div>

        {/* Global Falling Petals */}
        <FallingPetals active={config.heroSettings?.showPetals ?? true} count={30} className="z-[100] pointer-events-none fixed" />

        {/* 1. HERO / WEDDING INTRODUCTION */}
        <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-6 py-16 overflow-hidden">
          {/* Subtle floral decorations edges */}
          <div className="absolute inset-0 pointer-events-none opacity-40 flex flex-col justify-between">
            <div className="w-full h-40 bg-gradient-to-b from-[#FFF9F3] to-transparent z-10 absolute top-0" />
            <div className="absolute top-[-30px] left-[-30px] w-64 h-64 bg-[radial-gradient(circle_at_center,#B94E2F_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-20" />
            <div className="absolute bottom-[-30px] right-[-30px] w-64 h-64 bg-[radial-gradient(circle_at_center,#C9A45C_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-20" />
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 }}
            className="relative z-10 w-full max-w-sm flex flex-col items-center justify-center bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-[#C9A45C]/30 my-auto"
          >
            {/* Corner Decorative Lines */}
            <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-[#C9A45C]/60 rounded-tl-xl" />
            <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-[#C9A45C]/60 rounded-tr-xl" />
            <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-[#C9A45C]/60 rounded-bl-xl" />
            <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-[#C9A45C]/60 rounded-br-xl" />

            {/* Ganesha Motif */}
            <div className="w-14 h-14 flex items-center justify-center mb-5 text-[#B94E2F]">
              <GaneshaIcon className="w-full h-full opacity-90" />
            </div>

            {/* Shloka */}
            {config.heroSettings?.shloka && (
              <div className="mb-8 whitespace-pre-line text-xs text-[#C9A45C] font-semibold tracking-wider leading-relaxed">
                {config.heroSettings.shloka}
              </div>
            )}

            {/* Intro Text */}
            <p className="text-[#4B3A35] max-w-[95%] mx-auto text-[13px] md:text-sm leading-relaxed mb-10 italic">
              "With the blessings of the Almighty & our respected elders,<br/>we joyfully request your gracious presence on the wedding celebration of"
            </p>

            {/* Groom Name */}
            <div className="flex flex-col items-center w-full relative">
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] drop-shadow-sm">
                Trishi Bhatt
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-6 uppercase tracking-widest">
                Son of Devendra Kumar & Asha Sharma
              </p>
              
              {/* Separator */}
              <div className="flex items-center justify-center gap-3 w-full mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C9A45C]/50" />
                <span className="font-accent text-3xl text-[#C9A45C]">&amp;</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C9A45C]/50" />
              </div>

              {/* Bride Name */}
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] drop-shadow-sm">
                Hitakshi Sharma
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-2 uppercase tracking-widest">
                Daughter of Pradeep Sharma & Rekha Sharma
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

        {/* 2. SAVE THE DATE & SCRATCH CARDS */}
        <motion.section 
          id="scratch-reveal" 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="min-h-[100dvh] flex flex-col justify-center items-center py-20 px-6 relative z-10"
        >
          <div className="text-center mb-10">
            <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
              SAVE THE DATE
            </span>
            <h2 className="font-accent text-5xl md:text-6xl text-[#B94E2F] leading-tight drop-shadow-sm">
              Reveal Our<br/>Big Day
            </h2>
            <p className="font-serif-premium italic text-[#4B3A35] mt-4 text-sm md:text-base">
              Scratch the heart to reveal
            </p>
          </div>

          {/* 3 Red Hearts container */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-6 md:gap-10 w-full max-w-3xl mx-auto">
            {/* Heart 1: Date */}
            <div className="flex flex-col items-center">
              <div className="w-[110px] h-[110px] relative">
                <ScratchReveal
                  width={110}
                  height={110}
                  onReveal={() => setIsDateRevealed(true)}
                  content={
                    <div className={\`w-full h-full flex items-center justify-center transition-all duration-500 \${
                      isDateRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }\`}>
                      <span className="font-serif-premium text-3xl font-bold text-[#B94E2F]">
                        {dateOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 2: Month */}
            <div className="flex flex-col items-center">
              <div className="w-[110px] h-[110px] relative">
                <ScratchReveal
                  width={110}
                  height={110}
                  onReveal={() => setIsMonthRevealed(true)}
                  content={
                    <div className={\`w-full h-full flex items-center justify-center transition-all duration-500 \${
                      isMonthRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }\`}>
                      <span className="font-serif-premium text-2xl font-bold text-[#B94E2F] uppercase tracking-widest">
                        {monthOfMarry}
                      </span>
                    </div>
                  }
                />
              </div>
            </div>

            {/* Heart 3: Year */}
            <div className="flex flex-col items-center">
              <div className="w-[110px] h-[110px] relative">
                <ScratchReveal
                  width={110}
                  height={110}
                  onReveal={() => setIsYearRevealed(true)}
                  content={
                    <div className={\`w-full h-full flex items-center justify-center transition-all duration-500 \${
                      isYearRevealed 
                        ? "opacity-100 scale-100" 
                        : "opacity-0 scale-90"
                    }\`}>
                      <span className="font-serif-premium text-3xl font-bold text-[#B94E2F]">
                        {yearOfMarry}
                      </span>
                    </div>
                  }
                />
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
                className="mt-16 text-center overflow-hidden w-full"
              >
                <div className="w-12 h-[1px] bg-[#C9A45C] mx-auto mb-10" />
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold block mb-6">
                  OUR BIG DAY
                </span>
                <Countdown targetDate={config.weddingDate} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* 3. SACRED CEREMONIES / EVENTS */}
        {allHeartsScratched && config.weddingEvents?.length > 0 && (
          <motion.section 
            id="events"
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="py-20 px-4 md:px-8 relative z-10 w-full max-w-2xl mx-auto"
          >
            <div className="text-center mb-16">
              <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
                THE CELEBRATION UNFOLDS
              </span>
              <h2 className="font-accent text-5xl md:text-6xl text-[#B94E2F] drop-shadow-sm">
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
                // Parse date for elegant display
                let evtDate = event.time || event.date; // fallback logic
                // If it's a real Date string, format it.
                // Assuming event.date or event.time contains info
                
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
                      {event.time}
                    </span>
                    <h3 className="font-accent text-4xl md:text-5xl text-[#B94E2F] mb-6">
                      {event.eventName}
                    </h3>

                    {/* Media Card */}
                    <div className="relative w-full aspect-[4/5] md:aspect-video rounded-2xl overflow-hidden shadow-[0_10px_40px_rgb(0,0,0,0.08)] mb-6 border border-white/50">
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
                          path={event.thumbnailUrl || config.galleryImages?.[0]?.url || ""} 
                          alt={event.eventName}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
                        />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
                    </div>

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
              className="py-24 px-6 text-center flex flex-col items-center bg-[#FFF9F3] relative z-10"
            >
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">
                JOIN THE CELEBRATION
              </span>
              <h2 className="font-accent text-5xl md:text-6xl text-[#B94E2F] drop-shadow-sm mb-4">
                Celebrate<br/>With Us
              </h2>
              <p className="font-serif-premium italic text-[#765E52] max-w-sm mx-auto">
                A few beautiful moments before the big day!
              </p>
            </motion.section>

            {/* Deep Burgundy Closing Section */}
            <motion.section
              initial={{ opacity: 0 }} 
              whileInView={{ opacity: 1 }} 
              viewport={{ once: true }}
              transition={{ duration: 1 }}
              className="py-24 px-6 text-center flex flex-col items-center bg-[#641D2E] relative z-10 overflow-hidden"
            >
              {/* Decorative elements */}
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noiseFilter\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.85\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noiseFilter)\\'/%3E%3C/svg%3E')] mix-blend-overlay" />
              
              <div className="w-px h-16 bg-gradient-to-b from-transparent to-[#C9A45C] mb-12" />
              
              <h2 className="font-accent text-6xl md:text-7xl text-[#C9A45C] drop-shadow-lg leading-[1.1] z-10 relative">
                Trishi
                <br/>
                <span className="text-4xl">&amp;</span>
                <br/>
                Hitakshi
              </h2>

              <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#C9A45C] mt-12 mb-16" />

              <p className="font-serif-premium text-[#F8E9E2] text-sm md:text-base italic z-10 tracking-wide">
                With love,<br/>
                Trishi & Hitakshi
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
`;
  
  const newCode = before + newContent + after;
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Success replacing contents");
} else {
  console.log("Could not find start/end tags", startIndex, endIndex);
}
