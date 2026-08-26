import re

with open("src/App.tsx", "r") as f:
    code = f.read()

old = """      alert("Failed to save changes: " + (e instanceof Error ? e.message : String(e)));
    }
  };"""

new = """      alert("Failed to save changes: " + (e instanceof Error ? e.message : String(e)));
      throw e;
    }
  };"""

code = code.replace(old, new)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Added throw to App.tsx")
