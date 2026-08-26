import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Fix the blurry text: remove scale animation from motion.div
# old: initial={{ opacity: 0, scale: 0.95, y: 20 }}
#      animate={{ opacity: 1, scale: 1, y: 0 }}
code = code.replace("initial={{ opacity: 0, scale: 0.95, y: 20 }}", "initial={{ opacity: 0, y: 20 }}")
code = code.replace("animate={{ opacity: 1, scale: 1, y: 0 }}", "animate={{ opacity: 1, y: 0 }}")
# Also add some anti-aliasing to the text. We can remove `drop-shadow-sm` which causes blur on text.
code = code.replace('leading-[1.2] drop-shadow-sm', 'leading-[1.2] tracking-wide')
code = code.replace('backdrop-blur-md', 'backdrop-blur-xl') # maybe better background blur

# Make the admin button very faint and fixed at the end
old_admin_btn = '''        <div className="w-full text-center py-6 mt-12 mb-20 relative z-10 flex justify-center">
          <button 
            onClick={() => {
              const pwd = window.prompt("Enter Admin Password:");
              if (pwd === "6396") {
                setShowAdmin(true);
              } else if (pwd !== null) {
                alert("Incorrect password");
              }
            }} 
            className="text-[#C9A45C] hover:text-[#B94E2F] flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors px-4 py-2 border border-transparent hover:border-[#C9A45C]/30 rounded-full"
          >
            <Settings size={14} /> Admin Panel
          </button>
        </div>'''

new_admin_btn = '''        <div className="w-full text-center pb-8 pt-4 relative z-10 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => {
              const pwd = window.prompt("Enter Admin Password:");
              if (pwd === "6396") {
                setShowAdmin(true);
              } else if (pwd !== null) {
                alert("Incorrect password");
              }
            }} 
            className="text-[#C9A45C] flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors px-4 py-2"
          >
            <Settings size={12} /> Admin
          </button>
        </div>'''

code = code.replace(old_admin_btn, new_admin_btn)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated text blur and admin button opacity")
