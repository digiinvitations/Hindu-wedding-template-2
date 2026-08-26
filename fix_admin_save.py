import re

with open("src/components/AdminPanel.tsx", "r") as f:
    code = f.read()

# Remove auto-save
auto_save_regex = r"// Auto-save changes in real time\s*useEffect\(\(\) => \{\s*if \(isOpen\) \{\s*if \(JSON\.stringify\(editConfig\) !== JSON\.stringify\(config\)\) \{\s*const timer = setTimeout\(\(\) => \{\s*onConfigChange\(editConfig\);\s*setShowToast\(true\);\s*setTimeout\(\(\) => setShowToast\(false\), 2000\);\s*\}, 1500\);\s*return \(\) => clearTimeout\(timer\);\s*\}\s*\}\s*\}, \[editConfig, config, isOpen, onConfigChange\]\);"
code = re.sub(auto_save_regex, "", code, flags=re.DOTALL)

# Modify the first useEffect to only sync when opening the panel
sync_useEffect = r"useEffect\(\(\) => \{\s*setEditConfig\(config\);\s*\}, \[config\]\);"
new_sync_useEffect = """  useEffect(() => {
    if (isOpen) {
      setEditConfig(config);
    }
  }, [isOpen]);

  const handleSave = () => {
    onConfigChange(editConfig);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };
"""
code = re.sub(sync_useEffect, new_sync_useEffect, code)

# Add Save button to header
header_regex = r"(<h3 className=\"font-serif-premium text-2xl font-bold text-\[#4B3A35\]\">Admin Dashboard</h3>\s*)<button\s*onClick=\{onClose\}"
new_header = r"\1<button onClick={handleSave} className=\"bg-[#B94E2F] hover:bg-[#8F3B22] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95\">Save Changes</button>\n            <button onClick={onClose}"
code = re.sub(header_regex, new_header, code)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(code)

print("Updated AdminPanel.tsx with manual Save button")
