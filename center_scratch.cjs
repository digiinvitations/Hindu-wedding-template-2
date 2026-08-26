const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = 'className="py-16 px-4 md:px-8 max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center"';
const replaceStr = 'className="min-h-[100dvh] justify-center py-16 px-4 md:px-8 max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center"';

code = code.replace(targetStr, replaceStr);
fs.writeFileSync('src/App.tsx', code);
console.log("Success centering scratch card");
