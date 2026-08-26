import re

with open("src/components/AdminPanel.tsx", "r") as f:
    code = f.read()

handle_save_old = """  const handleSave = () => {
    onConfigChange(editConfig);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };"""

handle_save_new = """  const [isSaving, setIsSaving] = useState(false);
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onConfigChange(editConfig);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (e) {
      // Error is alerted by parent
    } finally {
      setIsSaving(false);
    }
  };"""

code = code.replace(handle_save_old, handle_save_new)

button_old = '<button onClick={handleSave} className="bg-[#B94E2F] hover:bg-[#8F3B22] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95">Save Changes</button>'
button_new = '<button onClick={handleSave} disabled={isSaving} className="bg-[#B94E2F] hover:bg-[#8F3B22] text-white px-6 py-2 rounded-xl text-sm font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2">{isSaving ? <><Loader2 size={16} className="animate-spin" /> Saving...</> : "Save Changes"}</button>'

code = code.replace(button_old, button_new)

with open("src/components/AdminPanel.tsx", "w") as f:
    f.write(code)

print("Fixed handleSave in AdminPanel")
