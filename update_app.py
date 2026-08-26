import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Make the wrapper for hearts flex-1 so it can shrink, and give it an aspect ratio if needed, or just w-full
old_wrapper_1 = '<div className="w-[115px] h-[100px] sm:w-[150px] sm:h-[130px] relative">'
new_wrapper_1 = '<div className="flex-1 w-full max-w-[150px] aspect-[15/13] relative">'
code = code.replace(old_wrapper_1, new_wrapper_1)

old_wrapper_2 = '<div className="w-[115px] h-[100px] sm:w-[150px] sm:h-[130px] relative flex justify-center items-center">'
new_wrapper_2 = '<div className="flex-1 w-full max-w-[150px] aspect-[15/13] relative flex justify-center items-center">'
code = code.replace(old_wrapper_2, new_wrapper_2)

# Ensure the parent row container can flex the children properly
old_row = '<div className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-6 w-full mx-auto overflow-visible">'
new_row = '<div className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-6 w-full max-w-lg mx-auto overflow-visible px-2">'
code = code.replace(old_row, new_row)

# Fix the shrink-0 on the items so they CAN shrink
code = code.replace('<div className="flex flex-col items-center shrink-0">', '<div className="flex flex-col items-center shrink min-w-0 w-1/3">')

# Update the celebration text
old_celebrate = """              <p className="font-serif-premium italic text-[#765E52] max-w-sm mx-auto">
                A few beautiful moments before the big day!
              </p>"""

new_celebrate = """              <p className="font-serif-premium text-[#765E52] max-w-lg mx-auto leading-relaxed text-sm md:text-base px-4">
                At last, the stars align, the families gather, and a new journey begins. With hearts overflowing with gratitude, we warmly invite you to celebrate our wedding and bless our forever.
              </p>"""

code = code.replace(old_celebrate, new_celebrate)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated App.tsx layout and text")
