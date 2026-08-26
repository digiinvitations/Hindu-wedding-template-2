with open("src/lib/db.ts", "r") as f:
    code = f.read()

import re
code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)

with open("src/lib/db.ts", "w") as f:
    f.write(code)
