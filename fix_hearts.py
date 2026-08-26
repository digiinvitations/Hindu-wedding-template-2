import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Restore flex-row
code = code.replace(
    'className="flex flex-col justify-center items-center gap-6 sm:gap-10 w-full mx-auto overflow-visible"',
    'className="flex flex-row flex-nowrap justify-center items-center gap-2 sm:gap-6 w-full mx-auto overflow-visible"'
)

# Fix sizing to make it wider horizontally than vertically (e.g. 115x100 on mobile, 160x140 on desktop)
code = re.sub(r'w-\[180px\] h-\[180px\]', 'w-[115px] h-[100px] sm:w-[150px] sm:h-[130px]', code)
code = re.sub(r'width={180}', 'width={150}', code)
code = re.sub(r'height={180}', 'height={130}', code)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated App.tsx layout and sizing")

with open("src/components/ScratchReveal.tsx", "r") as f:
    code = f.read()

# Replace the heart drawing logic to remove layers and just use one wide heart
old_drawing = """    // Draw 3 layers of hearts to give a layered cursive/artistic look
    // Layer 1 (Back)
    drawHeart(cx - 5, cy + 2, w * 0.9, h * 0.9, -0.1, grad1, '#5C2210');
    // Layer 2 (Middle)
    drawHeart(cx + 4, cy - 2, w * 0.85, h * 0.85, 0.15, grad2, '#8F3B22');
    // Layer 3 (Front)
    drawHeart(cx, cy, w * 0.75, h * 0.75, -0.05, grad3, '#A33D20');"""

new_drawing = """    // Draw 1 single clean heart, made slightly wider horizontally
    drawHeart(cx, cy, w * 0.95, h * 0.9, 0, grad3, '#A33D20');"""

code = code.replace(old_drawing, new_drawing)

with open("src/components/ScratchReveal.tsx", "w") as f:
    f.write(code)

print("Updated ScratchReveal layers")
