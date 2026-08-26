const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const adminButtonInFooter = `          {isOpened && (
            <button
              onClick={() => setShowAdmin(true)}
              className="relative z-10 text-pink-400/40 hover:text-pink-600 transition-all duration-300 opacity-60 hover:opacity-100 flex items-center gap-1.5 text-[10px] uppercase tracking-wider font-semibold"
              title="Open Host Admin Panel"
            >
              <Settings size={12} className="animate-[spin_10s_linear_infinite]" />
              <span>Admin</span>
            </button>
          )}`;

code = code.replace(adminButtonInFooter, '');

const floatingAdminButton = `      {/* Admin Floating Toggle (Bottom Right above Scroll-to-Top) */}
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
      
      {/* Scroll-to-Top Toggle (Bottom Right) */}`;

code = code.replace('{/* Scroll-to-Top Toggle (Bottom Right) */}', floatingAdminButton);

fs.writeFileSync('src/App.tsx', code);
console.log("Success floating admin panel modifications.");
