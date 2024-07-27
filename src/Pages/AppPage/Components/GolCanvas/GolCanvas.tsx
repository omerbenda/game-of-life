import { useEffect, useRef, useState } from 'react';

const DEFAULT_GRID_SIZE = 10;
const DEFAULT_CELL_SIZE = 10;

const paintGrid = (grid: boolean[][], ctx: CanvasRenderingContext2D) => {
  ctx.imageSmoothingQuality = 'low';
  ctx.fillRect(10, 10, DEFAULT_CELL_SIZE, DEFAULT_CELL_SIZE);
};

const GolCanvas = () => {
  const [grid, setGrid] = useState<boolean[][]>(
    Array<boolean[]>(DEFAULT_GRID_SIZE).fill(
      Array<boolean>(DEFAULT_GRID_SIZE).fill(false)
    )
  );
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        paintGrid(grid, ctx);
      }
    }
  }, [grid, canvasRef]);

  return (
    <canvas
      ref={canvasRef}
      width={1920}
      height={1080}
      className="[image-rendering:pixelated] w-full h-full"
    />
  );
};

export default GolCanvas;
