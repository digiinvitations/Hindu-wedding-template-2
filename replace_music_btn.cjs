const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '{/* 13. FLOATING BUTTONS */}';
const targetEnd = '{/* Admin Floating Toggle (Bottom Right above Scroll-to-Top) */}';

const startIndex = code.indexOf(targetStr);
const endIndex = code.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  
  const newContent = `
      {/* 13. FLOATING BUTTONS */}
      {/* Music Floating Toggle (Bottom Right) */}
      {isOpened && (
        <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3 group">
          <div className="relative">
            <button
              onClick={toggleMusic}
              className={\`relative w-12 h-12 rounded-full flex items-center justify-center font-bold shadow-[0_4px_15px_rgb(0,0,0,0.15)] cursor-pointer hover:scale-105 active:scale-95 transition-all duration-300 border border-[#C9A45C]/50 \${
                musicPlaying ? "bg-[#B94E2F] text-white animate-[pulse_2s_ease-in-out_infinite]" : "bg-[#FFF9F3] text-[#B94E2F]"
              }\`}
              title={musicPlaying ? "Mute Background Music" : "Play Background Music"}
            >
              {musicPlaying ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>
        </div>
      )}

      `;
  
  const newCode = before + newContent + after;
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Success replacing music btn");
} else {
  console.log("Could not find start/end tags", startIndex, endIndex);
}
