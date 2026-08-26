const fs = require('fs');
let code = fs.readFileSync('src/components/AdminPanel.tsx', 'utf8');

// 1. Remove password screen
code = code.replace(
  /const \[isAuthenticated, setIsAuthenticated\] = useState\(false\);/,
  'const [isAuthenticated, setIsAuthenticated] = useState(true);'
);

// Remove the `!isAuthenticated ? ... : (` check
const authCheckStart = `            {!isAuthenticated ? (`;
const authCheckEnd = `            ) : (`;

if (code.includes(authCheckStart)) {
  const s = code.indexOf(authCheckStart);
  const e = code.indexOf(authCheckEnd) + authCheckEnd.length;
  code = code.substring(0, s) + code.substring(e);
}

// And remove the closing `)}` at the end for the ternary operator
const closingParen = `                </div>
              </div>
            )}
          </motion.div>`;
const newClosingParen = `                </div>
              </div>
          </motion.div>`;
code = code.replace(closingParen, newClosingParen);

// 2. Remove tabs that are no longer needed.
code = code.replace(
  /const \[activeTab, setActiveTab\] = useState<"rsvps" \| "couple" \| "media" \| "assets" \| "events">\("rsvps"\);/,
  'const [activeTab, setActiveTab] = useState<"media" | "assets">("media");'
);

// We will just let the buttons for other tabs exist but they won't render anything, 
// OR better yet, we can strip the buttons.
const tabsToRemove = [
  '<Users size={16} /> RSVPs',
  '<Edit3 size={16} /> Couple Info',
  '<Map size={16} /> Events'
];

for (const tab of tabsToRemove) {
  // Find the button that contains this tab and remove it.
  const regex = new RegExp(`<button[^>]*>[^<]*${tab.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')}[^<]*</button>`, 'g');
  code = code.replace(regex, '');
}

fs.writeFileSync('src/components/AdminPanel.tsx', code);
console.log("Success admin panel modifications.");
