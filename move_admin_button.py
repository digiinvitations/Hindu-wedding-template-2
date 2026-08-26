import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Delete the floating toggle
admin_toggle_block_regex = r"\{\/\* Admin Floating Toggle \(Bottom Left\)\ \*\/.*?\}\s*\<\/AnimatePresence\>"
code = re.sub(admin_toggle_block_regex, "", code, flags=re.DOTALL)

# Insert the button at the very end of the main wrapper
end_wrapper = """      {/* Admin Dashboard Drawer/Modal */}"""

new_end_wrapper = """      {/* End of Website Admin Button */}
      {isOpened && (
        <div className="w-full text-center py-6 mt-12 mb-20 relative z-10 flex justify-center">
          <button 
            onClick={handleAdminClick} 
            className="text-[#C9A45C] hover:text-[#B94E2F] flex items-center gap-2 text-xs uppercase tracking-widest font-bold transition-colors px-4 py-2 border border-transparent hover:border-[#C9A45C]/30 rounded-full"
          >
            <Settings size={14} /> Admin Panel
          </button>
        </div>
      )}

      {/* Admin Dashboard Drawer/Modal */}"""

code = code.replace(end_wrapper, new_end_wrapper)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Admin button moved to end")
