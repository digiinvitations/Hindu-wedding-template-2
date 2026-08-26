import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Change flex-row to flex-col for the hearts
code = code.replace(
    'className="flex flex-row flex-nowrap justify-center items-center gap-3 sm:gap-6 w-full mx-auto overflow-visible"',
    'className="flex flex-col justify-center items-center gap-6 sm:gap-10 w-full mx-auto overflow-visible"'
)

# Change the sizes from 120 to 180
code = code.replace('w-[120px] h-[120px]', 'w-[180px] h-[180px]')
code = code.replace('width={120}', 'width={180}')
code = code.replace('height={120}', 'height={180}')

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Made hearts a column and larger")
