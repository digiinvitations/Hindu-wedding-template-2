import re

with open("src/App.tsx", "r") as f:
    code = f.read()

code = code.replace("w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]", "w-[120px] h-[120px]")

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed container sizes 2")
