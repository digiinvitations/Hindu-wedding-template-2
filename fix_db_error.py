import re
with open("src/lib/db.ts", "r") as f:
    code = f.read()

code = code.replace("const auth = getAuth();", """
  let authInfo = {};
  try {
    const auth = getAuth();
    authInfo = {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email
    };
  } catch (e) {
    console.warn("Auth not initialized, skipping auth info in error");
  }
""")
code = code.replace("authInfo: {", "authInfo: authInfo, /*")
code = code.replace("})) || []\n    },", "*/")

with open("src/lib/db.ts", "w") as f:
    f.write(code)
print("Fixed db.ts")
