import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Change the text OUR BIG DAY to "The start of a beautiful journey..."
code = code.replace(
    '''<span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold block mb-6">
                  OUR BIG DAY
                </span>''',
    '''<span className="font-accent text-3xl text-[#B94E2F] block mb-6">
                  The start of a beautiful journey...
                </span>'''
)

# Also make the scratch cards larger
# They are currently w-[85px] h-[85px] sm:w-[110px] sm:h-[110px]
# Let's change to w-[100px] h-[100px] sm:w-[130px] sm:h-[130px]
code = code.replace("w-[85px] h-[85px] sm:w-[110px] sm:h-[110px]", "w-[100px] h-[100px] sm:w-[130px] sm:h-[130px]")
code = code.replace("width={90}", "width={120}")
code = code.replace("height={90}", "height={120}")

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated text and size")
