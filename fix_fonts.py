import re

with open("src/App.tsx", "r") as f:
    code = f.read()

code = re.sub(r' style=\{\{\s*fontFamily:\s*.*?,\s*cursive.*?\}\}', '', code)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fonts fixed")
