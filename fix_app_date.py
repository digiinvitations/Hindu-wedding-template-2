import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Add a function to format date
date_format_func = """  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    // Check if it's in YYYY-MM-DD format
    if (/\d{4}-\d{2}-\d{2}/.test(dateStr)) {
      const date = new Date(dateStr);
      // add timezone offset workaround if needed, but simple parsing is fine
      return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return dateStr;
  };
"""

if "const formatEventDate" not in code:
    code = code.replace("  const [isPlaying, setIsPlaying] = useState(false);", date_format_func + "\n  const [isPlaying, setIsPlaying] = useState(false);")

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated App.tsx with formatEventDate")
