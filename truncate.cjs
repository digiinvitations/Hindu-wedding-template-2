const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');
const startMatch = '<div className="text-center relative z-10 mb-8 mt-[-2rem]">';
const endMatch = '{/* FOOTER */}';

if (code.includes(startMatch) && code.includes(endMatch)) {
  const startIndex = code.indexOf(startMatch);
  const endIndex = code.indexOf(endMatch);
  code = code.substring(0, startIndex) + code.substring(endIndex);
  fs.writeFileSync('src/App.tsx', code);
  console.log("Success");
} else {
  console.log("Failed to find matches");
}
