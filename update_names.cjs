const fs = require('fs');
let code = fs.readFileSync('src/weddingConfig.ts', 'utf8');

code = code.replace(/name: "Hitakshi"/, 'name: "Hitakshi Sharma"');
code = code.replace(/name: "Trishi"/, 'name: "Trishi Bhatt"');

fs.writeFileSync('src/weddingConfig.ts', code);
console.log("Success updating names in config to full names");
