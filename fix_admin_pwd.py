import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Make the admin panel button fix to the end of the website.
# In the previous step, I placed it at the bottom: 
# <div className="w-full text-center py-6 mt-12 mb-20 relative z-10 flex justify-center">

# I'll update it to check the password:

old_click = "onClick={handleAdminClick}"
new_click = '''onClick={() => {
              const pwd = window.prompt("Enter Admin Password:");
              if (pwd === "6396") {
                setShowAdmin(true);
              } else if (pwd !== null) {
                alert("Incorrect password");
              }
            }}'''

if 'const handleAdminClick =' in code:
    # If handleAdminClick exists, replace it
    code = re.sub(r'const handleAdminClick = \(\) => \{.*?\};', '', code, flags=re.DOTALL)
    
code = code.replace(old_click, new_click)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Password updated")
