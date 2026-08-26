import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Date font
code = code.replace(
    'className="font-serif-premium text-2xl sm:text-3xl font-bold text-[#B94E2F]"',
    'className="font-serif-premium text-4xl sm:text-5xl font-bold text-[#B94E2F]"'
)

# Month font
code = code.replace(
    'className="font-serif-premium text-xl sm:text-2xl font-bold text-[#B94E2F] uppercase tracking-widest text-center"',
    'className="font-serif-premium text-3xl sm:text-4xl font-bold text-[#B94E2F] uppercase tracking-widest text-center"'
)

# Year font is the same as Date font class, so it was already replaced by the first one!

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed text sizes")
