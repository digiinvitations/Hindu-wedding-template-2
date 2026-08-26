with open("src/App.tsx", "r") as f:
    code = f.read()

date_format_func = """  const formatEventDate = (dateStr: string) => {
    if (!dateStr) return "";
    if (/\\d{4}-\\d{2}-\\d{2}/.test(dateStr)) {
      const date = new Date(dateStr);
      const userTimezoneOffset = date.getTimezoneOffset() * 60000;
      const trueDate = new Date(date.getTime() + userTimezoneOffset);
      return trueDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }
    return dateStr;
  };
"""

if "const formatEventDate" not in code:
    code = code.replace("  const [isOpened, setIsOpened] = useState(false);", date_format_func + "\n  const [isOpened, setIsOpened] = useState(false);")

with open("src/App.tsx", "w") as f:
    f.write(code)
