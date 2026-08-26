const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const heroStart = '{/* 3. HERO SECTION */}';
const scratchStart = '{/* SCRATCH CARD REVEAL SECTION */}';

const hIdx = code.indexOf(heroStart);
const sIdx = code.indexOf(scratchStart);

if (hIdx !== -1 && sIdx !== -1) {
  const before = code.substring(0, hIdx);
  const after = code.substring(sIdx);
  fs.writeFileSync('src/App.tsx', before + after);
  console.log("Success removing hero");
} else {
  console.log("Could not find boundaries");
}
