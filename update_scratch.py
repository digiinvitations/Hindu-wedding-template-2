import re

with open("src/components/ScratchReveal.tsx", "r") as f:
    code = f.read()

# Update handlePointerDown
old_down = """  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    setHasScratchStarted(true);
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      lastPoint.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };"""

new_down = """  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
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
  };"""

code = code.replace(old_down, new_down)

# Update scratch
old_scratch = """  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    setHasScratchStarted(true);
    const rect = canvas.getBoundingClientRect();
    const currentPoint = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };"""

new_scratch = """  const scratch = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current || isRevealed) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx || !lastPoint.current) return;

    setHasScratchStarted(true);
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const currentPoint = {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };"""

code = code.replace(old_scratch, new_scratch)

# Update return statement
old_return = """  return (
    <div className="relative inline-block" style={{ width, height }}>
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300"
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
        className="absolute inset-0 cursor-pointer touch-none shadow-lg rounded-lg"
      />
    </div>
  );"""

new_return = """  return (
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
  );"""

code = code.replace(old_return, new_return)

with open("src/components/ScratchReveal.tsx", "w") as f:
    f.write(code)

print("Updated ScratchReveal logic")
