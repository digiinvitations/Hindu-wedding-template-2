const fs = require('fs');
let code = fs.readFileSync('src/components/ScratchReveal.tsx', 'utf8');

const targetGrad = `    grad.addColorStop(0, '#ff1a40'); // vibrant rich red
    grad.addColorStop(0.5, '#e60026'); // pure red
    grad.addColorStop(1, '#b30019'); // deep rich ruby red
    ctx.fillStyle = grad;`;

const newGrad = `    grad.addColorStop(0, '#C25738'); // bright terracotta
    grad.addColorStop(0.5, '#B94E2F'); // primary terracotta
    grad.addColorStop(1, '#8F3B22'); // deep burnt orange
    ctx.fillStyle = grad;`;

const targetStroke = `    ctx.strokeStyle = '#cc001b'; // rich crimson border`;
const newStroke = `    ctx.strokeStyle = '#A33D20'; // deeper terracotta border`;

code = code.replace(targetGrad, newGrad);
code = code.replace(targetStroke, newStroke);

// Add "SCRATCH" text
const targetReflection = `    // Add a gentle glossy reflection shine to make the red heart pop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.3, w * 0.12, h * 0.08, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();`;

const newReflection = `    // Add a gentle glossy reflection shine to make the heart pop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.beginPath();
    ctx.ellipse(x + w * 0.3, y + h * 0.3, w * 0.12, h * 0.08, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add "SCRATCH" text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.font = 'bold 12px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', w / 2 + x, h / 2 + y + 5);
`;

code = code.replace(targetReflection, newReflection);

fs.writeFileSync('src/components/ScratchReveal.tsx', code);
console.log("Success updating scratch component");
