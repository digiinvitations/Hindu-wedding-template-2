with open("src/App.tsx", "r") as f:
    code = f.read()

# I need to close the extra div before {/* COUNTDOWN REVEAL */}
code = code.replace('{/* COUNTDOWN REVEAL */}', '</div>\n\n          {/* COUNTDOWN REVEAL */}')

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed closing div")
