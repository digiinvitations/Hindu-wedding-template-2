import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Add a small separator between events
old_map_end = """                      </a>
                    )}
                  </motion.div>
                );
              })}"""

new_map_end = """                      </a>
                    )}
                    
                    {/* Separator between events */}
                    {index !== config.weddingEvents.length - 1 && (
                      <div className="flex items-center justify-center mt-12 w-full opacity-60">
                        <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#C9A45C]" />
                        <div className="w-2 h-2 rotate-45 border border-[#C9A45C] mx-3" />
                        <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#C9A45C]" />
                      </div>
                    )}
                  </motion.div>
                );
              })}"""

code = code.replace(old_map_end, new_map_end)


# Make heading of scratch card section to top
# Before it was:
# <div className="text-center mb-10 w-full">
#   <span className="font-sans text-[10px] md:text-xs uppercase tracking-[0.3em] text-[#C9A45C] font-bold mb-4 block">SAVE THE DATE</span>
#   <h2 className="font-accent text-5xl sm:text-6xl text-[#B94E2F] leading-tight drop-shadow-sm">Reveal Our<br/>Big Day</h2>
#   <p className="font-serif-premium italic text-[#4B3A35] mt-4 text-sm md:text-base">Scratch the heart to reveal</p>
# </div>
#
# Let's verify how it is currently placed.
# Wait, it's ALREADY at the top of the scratch card section!
# "make the heading of scratch card section to top"
# Maybe it's centered vertically alongside the hearts on desktop?
# Let's look at section structure.
# <motion.section id="scratch-reveal" className="min-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] mx-auto flex flex-col justify-center items-center py-20 px-4 sm:px-6 relative z-10">
# Since it's flex flex-col justify-center items-center, it's vertically centered.
# To make the heading to the top, we can use flex-col justify-start instead of justify-center.
old_scratch_section_class = 'className="min-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] mx-auto flex flex-col justify-center items-center py-20 px-4 sm:px-6 relative z-10"'
new_scratch_section_class = 'className="min-h-[100dvh] w-full max-w-[calc(100dvh*9/16)] mx-auto flex flex-col justify-start pt-24 pb-20 items-center px-4 sm:px-6 relative z-10"'
code = code.replace(old_scratch_section_class, new_scratch_section_class)

# And make the hearts vertically centered by wrapping them in a flex-1 flex-col justify-center container
old_hearts_container = '<div className="flex flex-row flex-nowrap justify-center items-center gap-3 sm:gap-6 w-full mx-auto overflow-visible">'
new_hearts_container = '<div className="flex-1 flex flex-col justify-center w-full"><div className="flex flex-row flex-nowrap justify-center items-center gap-3 sm:gap-6 w-full mx-auto overflow-visible">'

code = code.replace(old_hearts_container, new_hearts_container)

old_countdown = '{/* Scratching Completion Countdown */}'
new_countdown = '</div>\n\n          {/* Scratching Completion Countdown */}'
code = code.replace(old_countdown, new_countdown)


# Make Ceremony Headings flowing calligraphy font. 
# Right now it says: `<h3 className="font-accent text-5xl md:text-6xl text-[#B94E2F] mb-6">`
# Let's change font-accent to use Great Vibes. The tailwind config already maps `--font-accent` to Great Vibes.
# But just to be sure it's fully styled, I'll add `style={{ fontFamily: "'Great Vibes', cursive" }}` as a fallback or explicitly make sure it's highly cursive.
# Actually, the user says "flowing calligraphy font". Great Vibes is that. Let me double check if I can just inject it.
code = code.replace('className="font-accent text-5xl md:text-6xl text-[#B94E2F] mb-6"', 'className="font-accent text-5xl md:text-6xl text-[#B94E2F] mb-6" style={{ fontFamily: "\\"Great Vibes\\", cursive" }}')


with open("src/App.tsx", "w") as f:
    f.write(code)

print("Updated App.tsx")
