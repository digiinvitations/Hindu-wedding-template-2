import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# Add handleAdminClick
old_state = '  const [showAdmin, setShowAdmin] = useState(false);'
new_state = '''  const [showAdmin, setShowAdmin] = useState(false);

  const handleAdminClick = () => {
    const pwd = window.prompt("Enter Admin Password (6396):");
    if (pwd === "6396") {
      setShowAdmin(true);
    } else if (pwd !== null) {
      alert("Incorrect password");
    }
  };'''
code = code.replace(old_state, new_state)

# Replace the onClick handler for the admin button
old_button_click = 'onClick={() => setShowAdmin(true)}'
new_button_click = 'onClick={handleAdminClick}'
code = code.replace(old_button_click, new_button_click)

# Move from left-6 to right-6, maybe offset it? 
# The user said "fix to end of the website". 
# End = right in LTR. Let's make it fixed bottom-6 left-6 to fixed bottom-6 right-24 (so it doesn't overlap music)
# But actually, I'll place it right in the footer.
code = code.replace('className="fixed bottom-6 left-6 z-40 group"', 'className="fixed bottom-6 right-24 z-40 group"')

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Admin button updated")
