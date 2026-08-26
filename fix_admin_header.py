with open("src/components/AdminPanel.tsx", "r") as f:
    code = f.read()

old = """              <button
                onClick={onClose}
                className="text-[#765E52] hover:text-[#B94E2F] hover:bg-[#B94E2F]/10 p-2 rounded-full cursor-pointer transition-colors"
              >
                <X size={20} />
              </button>
            </div>"""

new = """              <div className="flex items-center gap-3">
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
            </div>"""

code = code.replace(old, new)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(code)
print("Added save button")
