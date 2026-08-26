import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Fix footer section
code = re.sub(
    r'Trishi\s*<br/>\s*<span className="text-4xl">&amp;</span>\s*<br/>\s*Hitakshi',
    r'{config.bride.name.split(" ")[0]}\n                <br/>\n                <span className="text-4xl">&amp;</span>\n                <br/>\n                {config.groom.name.split(" ")[0]}',
    code
)

code = re.sub(
    r'Trishi & Hitakshi',
    r'{config.bride.name.split(" ")[0]} &amp; {config.groom.name.split(" ")[0]}',
    code
)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Fixed footer")
