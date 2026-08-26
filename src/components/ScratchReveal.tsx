import React, { useRef, useEffect, useState } from 'react';

interface ScratchRevealProps {
  content: React.ReactNode;
  onReveal: () => void;
  width?: number;
  height?: number;
}

export function ScratchReveal({ content, onReveal, width = 300, height = 100 }: ScratchRevealProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [hasScratchStarted, setHasScratchStarted] = useState(false);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number, y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const x = 5;
    const y = 5;
    const w = canvas.width - 10;
    const h = canvas.height - 10;

    
    // Create a beautiful, rich, fully-saturated pure red gradient
    const grad1 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad1.addColorStop(0, '#8F3B22'); // deep burnt orange
    grad1.addColorStop(1, '#5C2210');

    const grad2 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad2.addColorStop(0, '#B94E2F');
    grad2.addColorStop(1, '#8F3B22');
    
    const grad3 = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad3.addColorStop(0, '#D46A4C');
    grad3.addColorStop(1, '#B94E2F');

    const drawHeart = (cx: number, cy: number, w: number, h: number, rot: number, fillGrad: CanvasGradient, strokeColor: string) => {
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(rot);
      ctx.beginPath();
      const topCurveHeight = h * 0.3;
      ctx.moveTo(0, -h/2 + topCurveHeight);
      
      // Top-left curve
      ctx.bezierCurveTo(
        0, -h/2,
        -w/2, -h/2,
        -w/2, -h/2 + topCurveHeight
      );
      // Bottom-left curve
      ctx.bezierCurveTo(
        -w/2, 0,
        0, h/2,
        0, h/2
      );
      // Bottom-right curve
      ctx.bezierCurveTo(
        0, h/2,
        w/2, 0,
        w/2, -h/2 + topCurveHeight
      );
      // Top-right curve
      ctx.bezierCurveTo(
        w/2, -h/2,
        0, -h/2,
        0, -h/2 + topCurveHeight
      );
      
      ctx.closePath();
      ctx.fillStyle = fillGrad;
      ctx.fill();
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.restore();
    };

    const cx = x + w / 2;
    const cy = y + h / 2;

    // Draw 1 single clean heart, made slightly wider horizontally
    drawHeart(cx, cy, w * 0.95, h * 0.9, 0, grad3, '#A33D20');

    // Add a gentle glossy reflection shine to make the front heart pop
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.beginPath();
    ctx.ellipse(cx - w * 0.15, cy - h * 0.15, w * 0.1, h * 0.06, -Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    // Add "SCRATCH" text
    ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
    ctx.font = 'bold 11px "Montserrat", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('SCRATCH', cx, cy);


  }, [width, height]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    setHasScratchStarted(true);
    const canvas = canvasRef.current;
    const rect = canvas?.getBoundingClientRect();
    if (rect && canvas) {
      const scaleX = canvas.width / rect.width;
      const scaleY = canvas.height / rect.height;
      lastPoint.current = {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
  };

  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    setHasScratchStarted(true);

    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = 55;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();

    lastPoint.current = currentPoint;

    // Check if revealed enough
    checkReveal();
  };

  const handlePointerUp = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  const checkReveal = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let opaquePixels = 0;

    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] > 10) {
        opaquePixels++;
      }
    }

    const totalPixels = pixels.length / 4;
    // Since the heart is drawn over a transparent background, the initial opaque pixels are about 50-60% of total pixels.
    // If the remaining opaque pixels drop below 12% of total pixels, it means the heart has been mostly scratched off.
    const opaquePercentage = (opaquePixels / totalPixels) * 100;

    if (opaquePercentage < 35 && !isRevealed) {
      setIsRevealed(true);
      onReveal();
      // Animate canvas fade out
      canvas.style.transition = 'opacity 0.5s ease-out';
      canvas.style.opacity = '0';
      setTimeout(() => {
        canvas.style.display = 'none';
      }, 500);
    }
  };

  return (
    <div className="relative w-full h-full" style={{ maxWidth: width, maxHeight: height, aspectRatio: `${width}/${height}` }}>
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300 z-10"
        style={{ opacity: (isRevealed || hasScratchStarted) ? 1 : 0 }}
      >
        {content}
      </div>
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        onPointerDown={handlePointerDown}
        onPointerMove={scratch}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        onPointerCancel={handlePointerUp}
        className="absolute inset-0 cursor-pointer touch-none w-full h-full z-20 drop-shadow-xl"
        style={{ WebkitTapHighlightColor: 'transparent' }}
      />
    </div>
  );
}
