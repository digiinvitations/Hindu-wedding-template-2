const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = '{/* Admin Floating Toggle (Bottom Right above Scroll-to-Top) */}';
const targetEnd = '{/* RSVP Confirmation Modal */}';

const startIndex = code.indexOf(targetStr);
const endIndex = code.indexOf(targetEnd);

if (startIndex !== -1 && endIndex !== -1) {
  const before = code.substring(0, startIndex);
  const after = code.substring(endIndex);
  
  const newContent = `
      {/* Admin Floating Toggle (Bottom Left) */}
      <AnimatePresence>
        {isOpened && (
          <motion.div
            key="admin-toggle"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="fixed bottom-6 left-6 z-40 group"
          >
            <div className="relative">
              <button
                onClick={() => setShowAdmin(true)}
                className="w-12 h-12 rounded-full bg-gradient-to-br from-[#765E52] to-[#4B3A35] text-white font-bold flex items-center justify-center shadow-xl border border-[#C9A45C]/30 cursor-pointer hover:scale-105 active:scale-95 transition-transform"
                title="Open Admin Panel"
              >
                <Settings size={20} className="stroke-[2]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Scroll-to-Top Toggle (Bottom Right above Music) */}
      <AnimatePresence>
        {isOpened && showScrollTop && (
          <motion.div
            key="scroll-top"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
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

      `;
  
  const newCode = before + newContent + after;
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Success replacing admin btn");
} else {
  console.log("Could not find start/end tags", startIndex, endIndex);
}
