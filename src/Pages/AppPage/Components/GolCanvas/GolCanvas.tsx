import { useEffect, useRef, useState } from 'react';

const DEFAULT_GRID_SIZE = 10;
const CANVAS_RESOLUTION = 500;

const paintGrid = (grid: boolean[][], ctx: CanvasRenderingContext2D): void => {
  const cellSize = CANVAS_RESOLUTION / DEFAULT_GRID_SIZE;

  for (let row = 0; row < DEFAULT_GRID_SIZE; row++) {
    for (let col = 0; col < DEFAULT_GRID_SIZE; col++) {
      const startX = col * cellSize;
      const startY = row * cellSize;

      ctx.fillStyle = grid[row][col] ? 'white' : 'black';
      ctx.fillRect(startX, startY, cellSize, cellSize);
    }
  }
};

const createGrid = (size: number): boolean[][] => {
  const grid: boolean[][] = Array<boolean[]>();

  for (let iter = 0; iter < size; iter++) {
    grid.push(Array<boolean>(size).fill(false));
  }

  return grid;
};

const GolCanvas = () => {
  const [grid, setGrid] = useState<boolean[][]>(createGrid(DEFAULT_GRID_SIZE));
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
      width={CANVAS_RESOLUTION}
      height={CANVAS_RESOLUTION}
      className="[image-rendering:pixelated] aspect-square h-full"
    />
  );
};

export default GolCanvas;
