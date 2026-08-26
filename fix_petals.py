import re

with open("src/components/FallingPetals.tsx", "r") as f:
    code = f.read()

# Add type property
code = code.replace("driftClass: string;", "driftClass: string;\n  type: 'petal' | 'confetti_square' | 'confetti_circle';")
# Set type in initialPetals
code = code.replace("driftClass: drifts[Math.floor(Math.random() * drifts.length)],", "driftClass: drifts[Math.floor(Math.random() * drifts.length)],\n      type: Math.random() > 0.6 ? (Math.random() > 0.5 ? 'confetti_square' : 'confetti_circle') : 'petal',")

# Update rendering logic
svg_old = """          {/* Simple petal SVG */}
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12,22 C12,22 17,16 17,12 C17,8 14.5,6 12,6 C9.5,6 7,8 7,12 C7,16 12,22 12,22 Z" />
          </svg>"""

svg_new = """          {p.type === 'petal' ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12,22 C12,22 17,16 17,12 C17,8 14.5,6 12,6 C9.5,6 7,8 7,12 C7,16 12,22 12,22 Z" />
            </svg>
          ) : p.type === 'confetti_square' ? (
            <div className="w-full h-full bg-current" style={{ transform: 'rotate(45deg)' }} />
          ) : (
            <div className="w-full h-full bg-current rounded-full" />
          )}"""

code = code.replace(svg_old, svg_new)

with open("src/components/FallingPetals.tsx", "w") as f:
    f.write(code)

print("Added confetti")
