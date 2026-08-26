const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const heroStartStr = '{/* 3. HERO SECTION */}';
const scratchSectionStr = '{/* SCRATCH CARD REVEAL SECTION */}';

const startIdx = code.indexOf(heroStartStr);
const endIdx = code.indexOf(scratchSectionStr);

if (startIdx !== -1 && endIdx !== -1) {
  const beforeHero = code.substring(0, startIdx);
  const afterHero = code.substring(endIdx);
  
  const newHero = `{/* 3. HERO SECTION */}
        <section id="hero" className="relative min-h-[100dvh] flex flex-col justify-center items-center text-center px-4 overflow-hidden bg-[#F8F4EA]">
          
          {/* Subtle faded floral patterns near edges */}
          <div className="absolute inset-0 pointer-events-none opacity-40">
            {/* Top Left */}
            <div className="absolute top-[-50px] left-[-50px] w-72 h-72 bg-[radial-gradient(circle_at_center,#B65336_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-30" />
            {/* Bottom Right */}
            <div className="absolute bottom-[-50px] right-[-50px] w-72 h-72 bg-[radial-gradient(circle_at_center,#A98A55_0%,transparent_60%)] mix-blend-multiply blur-3xl opacity-30" />
            
            {/* Organic Confetti / Petal elements */}
            <div className="absolute top-[15%] right-[15%] w-1.5 h-1.5 rounded-full bg-[#B65336]/40 blur-[0.5px]" />
            <div className="absolute top-[25%] left-[20%] w-2 h-2 rounded-full bg-[#A98A55]/30 blur-[0.5px]" />
            <div className="absolute bottom-[25%] right-[25%] w-2.5 h-2.5 rounded-full bg-[#B65336]/40 blur-[0.5px]" />
            <div className="absolute bottom-[15%] left-[15%] w-1 h-1 rounded-full bg-[#A98A55]/40 blur-[0.5px]" />
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
            className="relative z-10 w-full max-w-lg flex flex-col items-center justify-center py-16"
          >
            {/* Ganesha Motif */}
            <div className="w-16 h-16 flex items-center justify-center mb-6">
              <GaneshaIcon className="w-full h-full text-[#A98A55] opacity-90" />
            </div>

            {/* Shloka */}
            {config.heroSettings?.shloka && (
              <div className="mb-10 whitespace-pre-line text-sm font-serif-premium text-[#765E52] leading-relaxed font-medium">
                {config.heroSettings.shloka}
              </div>
            )}

            {/* Intro Text */}
            <p className="font-serif-premium italic text-[#765E52] max-w-[85%] mx-auto text-base md:text-lg leading-relaxed mb-12">
              "With the blessings of the Almighty & our respected elders, we joyfully request your gracious presence on the wedding celebration of"
            </p>

            {/* Couple Names */}
            <div className="flex flex-col items-center mb-12 w-full relative">
              <h1 className="font-accent text-6xl md:text-7xl text-[#B65336] m-0 font-normal leading-[1.1] z-10 drop-shadow-sm">
                Trishi Bhatt
              </h1>
              <span className="font-serif-premium text-2xl md:text-3xl text-[#A98A55] italic font-light my-2 z-10 relative">
                &amp;
              </span>
              <h1 className="font-accent text-6xl md:text-7xl text-[#B65336] m-0 font-normal leading-[1.1] z-10 drop-shadow-sm">
                Hitakshi Sharma
              </h1>
            </div>

            {/* Parents Details */}
            <div className="flex flex-col gap-3 font-serif-premium text-[#765E52] text-sm md:text-base tracking-widest uppercase items-center">
              <p className="border-b border-[#A98A55]/20 pb-2">Son of Devendra Kumar &amp; Asha Sharma</p>
              <p className="pt-1">Daughter of Pradeep Sharma &amp; Rekha Sharma</p>
            </div>
          </motion.div>
          
          {/* Scroll Prompt Arrow */}
          <div className="absolute bottom-8 z-10 flex flex-col items-center cursor-pointer select-none text-[#A98A55]/70 hover:text-[#A98A55] transition-colors" onClick={() => document.getElementById("scratch-reveal")?.scrollIntoView({behavior: "smooth"})}>
            <span className="font-serif-premium text-[10px] uppercase tracking-[0.3em] mb-2">
              Scroll
            </span>
            <div className="w-3 h-3 border-b border-r border-current rotate-45 animate-bounce" />
          </div>

          <FallingPetals active={config.heroSettings?.showPetals ?? true} count={25} className="z-[100]" />
        </section>

        `;
  
  fs.writeFileSync('src/App.tsx', beforeHero + newHero + afterHero);
  console.log("Success replacing hero");
} else {
  console.log("Could not find boundaries");
}
