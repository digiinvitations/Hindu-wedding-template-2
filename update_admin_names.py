import re

with open("src/components/AdminPanel.tsx", "r") as f:
    code = f.read()

# Add Couple Names fields to Hero tab
couple_names_fields = """
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Bride Name</label>
                        <input 
                          type="text" 
                          value={editConfig.bride?.name || ''}
                          onChange={e => setEditConfig(c => ({...c, bride: {...c.bride, name: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-[11px] font-semibold text-[#765E52] mb-1.5 uppercase tracking-wide">Groom Name</label>
                        <input 
                          type="text" 
                          value={editConfig.groom?.name || ''}
                          onChange={e => setEditConfig(c => ({...c, groom: {...c.groom, name: e.target.value}}))}
                          className="w-full bg-white border border-[#C9A45C]/30 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#B94E2F]"
                        />
                      </div>
"""

# Find where to insert it. Let's put it right after Hero Customization
target = """<h4 className="text-sm font-bold text-[#4B3A35] flex items-center gap-2 uppercase tracking-widest border-b border-[#C9A45C]/20 pb-3">
                        Hero Customization
                      </h4>"""

code = code.replace(target, target + couple_names_fields)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(code)

print("Updated AdminPanel.tsx with bride and groom names")
