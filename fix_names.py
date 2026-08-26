import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Swap Hero Section
old_hero = '''            {/* Groom Name */}
            <div className="flex flex-col items-center w-full relative">
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.groom.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-6 uppercase tracking-widest text-center">
                {config.heroSettings?.groomParents || `Son of ${config.groom.fatherName} & ${config.groom.motherName}`}
              </p>
              
              {/* Separator */}
              <div className="flex items-center justify-center gap-3 w-full mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C9A45C]/50" />
                <span className="font-accent text-3xl text-[#C9A45C]">&amp;</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C9A45C]/50" />
              </div>

              {/* Bride Name */}
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.bride.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-2 uppercase tracking-widest text-center">
                {config.heroSettings?.brideParents || `Daughter of ${config.bride.fatherName} & ${config.bride.motherName}`}
              </p>
            </div>'''

new_hero = '''            {/* Bride Name */}
            <div className="flex flex-col items-center w-full relative">
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.bride.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-6 uppercase tracking-widest text-center">
                {config.heroSettings?.brideParents || `Daughter of ${config.bride.fatherName} & ${config.bride.motherName}`}
              </p>
              
              {/* Separator */}
              <div className="flex items-center justify-center gap-3 w-full mb-6">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C9A45C]/50" />
                <span className="font-accent text-3xl text-[#C9A45C]">&amp;</span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C9A45C]/50" />
              </div>

              {/* Groom Name */}
              <h1 className="font-accent text-5xl md:text-6xl text-[#B94E2F] m-0 font-normal leading-[1.2] tracking-wide">
                {config.groom.name}
              </h1>
              <p className="text-[11px] md:text-xs text-[#765E52] mt-2 mb-2 uppercase tracking-widest text-center">
                {config.heroSettings?.groomParents || `Son of ${config.groom.fatherName} & ${config.groom.motherName}`}
              </p>
            </div>'''

code = code.replace(old_hero, new_hero)

old_footer = '''              <h2 className="font-accent text-6xl md:text-7xl text-[#C9A45C]  leading-[1.1] z-10 relative">
                Trishi
                <br/>
                <span className="text-4xl">&amp;</span>
                <br/>
                Hitakshi
              </h2>
              <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#C9A45C] mt-12 mb-16" />
              <p className="font-serif-premium text-[#F8E9E2] text-sm md:text-base italic z-10 tracking-wide">
                With love,<br/>
                Trishi & Hitakshi
              </p>'''

new_footer = '''              <h2 className="font-accent text-6xl md:text-7xl text-[#C9A45C]  leading-[1.1] z-10 relative">
                {config.bride.name.split(" ")[0]}
                <br/>
                <span className="text-4xl">&amp;</span>
                <br/>
                {config.groom.name.split(" ")[0]}
              </h2>
              <div className="w-px h-16 bg-gradient-to-t from-transparent to-[#C9A45C] mt-12 mb-16" />
              <p className="font-serif-premium text-[#F8E9E2] text-sm md:text-base italic z-10 tracking-wide">
                With love,<br/>
                {config.bride.name.split(" ")[0]} &amp; {config.groom.name.split(" ")[0]}
              </p>'''

code = code.replace(old_footer, new_footer)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Swapped names")
