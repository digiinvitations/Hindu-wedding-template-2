import re

with open("src/App.tsx", "r") as f:
    code = f.read()

code = code.replace("width={180}", "width={150}")
code = code.replace("height={180}", "height={130}")

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed canvas prop sizes")
