import re

with open("src/App.tsx", "r") as f:
    code = f.read()

# 1. Add state variables for admin login
state_insert_point = "  const [showAdmin, setShowAdmin] = useState(false);"
state_insert_content = """  const [showAdmin, setShowAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPwd, setAdminPwd] = useState("");
  const [adminLoginError, setAdminLoginError] = useState(false);"""
code = code.replace(state_insert_point, state_insert_content)

# 2. Replace the window.prompt button with a state-driven approach
old_admin_btn = '''        <div className="w-full text-center pb-8 pt-4 relative z-10 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => {
              const pwd = window.prompt("Enter Admin Password:");
              if (pwd === "6396") {
                setShowAdmin(true);
              } else if (pwd !== null) {
                alert("Incorrect password");
              }
            }} 
            className="text-[#C9A45C] flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors px-4 py-2"
          >
            <Settings size={12} /> Admin
          </button>
        </div>'''

new_admin_btn = '''        <div className="w-full text-center pb-8 pt-4 relative z-10 flex flex-col items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300">
          {!showAdminLogin ? (
            <button 
              onClick={() => setShowAdminLogin(true)} 
              className="text-[#C9A45C] flex items-center gap-2 text-[10px] uppercase tracking-widest transition-colors px-4 py-2 cursor-pointer"
            >
              <Settings size={12} /> Admin
            </button>
          ) : (
            <div className="flex flex-col items-center gap-2 bg-[#FFF9F3] p-4 rounded-xl border border-[#C9A45C]/30 shadow-lg mt-2">
              <p className="text-[10px] uppercase tracking-widest text-[#B94E2F] font-bold">Admin Access</p>
              <div className="flex items-center gap-2">
                <input 
                  type="password"
                  value={adminPwd}
                  onChange={(e) => {
                    setAdminPwd(e.target.value);
                    setAdminLoginError(false);
                  }}
                  placeholder="Password"
                  className="px-3 py-1.5 text-xs rounded-md border border-[#C9A45C]/50 focus:outline-none focus:border-[#B94E2F] text-center w-24 bg-white"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      if (adminPwd === "6396") {
                        setShowAdmin(true);
                        setShowAdminLogin(false);
                        setAdminPwd("");
                      } else {
                        setAdminLoginError(true);
                      }
                    }
                  }}
                />
                <button 
                  onClick={() => {
                    if (adminPwd === "6396") {
                      setShowAdmin(true);
                      setShowAdminLogin(false);
                      setAdminPwd("");
                    } else {
                      setAdminLoginError(true);
                    }
                  }}
                  className="bg-[#C9A45C] text-white px-3 py-1.5 rounded-md text-xs font-bold hover:bg-[#B94E2F] transition-colors cursor-pointer"
                >
                  Go
                </button>
                <button 
                  onClick={() => {
                    setShowAdminLogin(false);
                    setAdminPwd("");
                    setAdminLoginError(false);
                  }}
                  className="text-[#765E52] px-2 py-1.5 rounded-md text-xs hover:text-black transition-colors cursor-pointer"
                >
                  X
                </button>
              </div>
              {adminLoginError && <p className="text-red-500 text-[10px] m-0">Incorrect password</p>}
            </div>
          )}
        </div>'''
        
code = code.replace(old_admin_btn, new_admin_btn)

with open("src/App.tsx", "w") as f:
    f.write(code)

print("Replaced window.prompt with inline custom login")
