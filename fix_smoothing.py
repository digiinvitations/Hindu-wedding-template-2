import re

with open("src/index.css", "r") as f:
    code = f.read()

if "text-rendering: optimizeLegibility;" not in code:
    code = code.replace("@tailwind utilities;", "@tailwind utilities;\n\nbody {\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n  text-rendering: optimizeLegibility;\n}")

with open("src/index.css", "w") as f:
    f.write(code)

print("Added anti-aliasing to CSS")
