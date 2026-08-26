import re

with open("index.html", "r") as f:
    code = f.read()

og_tags = """    <title>Wedding Ceremony Invitation</title>
    <meta property="og:title" content="We Are Engaged" />
    <meta property="og:description" content="You are joyfully invited to our wedding celebration!" />
    <meta property="og:image" content="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&h=630&q=80" />
    <meta property="og:type" content="website" />"""

code = code.replace("<title>Wedding Ceremony Invitation</title>", og_tags)

with open("index.html", "w") as f:
    f.write(code)

print("Updated index.html with OG tags")
