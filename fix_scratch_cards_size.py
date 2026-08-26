import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Fix the container sizes to match the canvas sizes (120x120)
code = code.replace("w-[100px] h-[100px] sm:w-[130px] sm:h-[130px]", "w-[120px] h-[120px] sm:w-[140px] sm:h-[140px]")
code = code.replace("width={120} // we can use the prop directly instead of full 110 on mobile to fit 3 in a row", "width={120}")

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed container sizes")
