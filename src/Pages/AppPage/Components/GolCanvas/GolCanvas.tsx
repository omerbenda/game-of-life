import { useEffect, useMemo, useRef, useState } from 'react';

const DEFAULT_GRID_SIZE = 10;
const CANVAS_RESOLUTION = 625;

const paintGrid = (grid: boolean[][], ctx: CanvasRenderingContext2D): void => {
  ctx.fillRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);
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

const copyGrid = (grid: boolean[][]): boolean[][] => {
  const copyGrid: boolean[][] = [];

  for (let row = 0; row < grid.length; row++) {
    const newRow: boolean[] = [];
    copyGrid.push(newRow);

    for (let col = 0; col < grid[row].length; col++) {
      newRow.push(grid[row][col]);
    }
  }

  return copyGrid;
};

const changeGridCell = (
  grid: boolean[][],
  cellX: number,
  cellY: number,
  value: boolean
): boolean[][] => {
  const newGrid: boolean[][] = copyGrid(grid);
  newGrid[cellY][cellX] = value;

  return newGrid;
};

const GolCanvas = () => {
  const [grid, setGrid] = useState<boolean[][]>(createGrid(DEFAULT_GRID_SIZE));
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCanvasPressed = useMemo(
    () =>
      (e: MouseEvent): void => {
        const cellSize = CANVAS_RESOLUTION / DEFAULT_GRID_SIZE;
        const clickX = e.pageX - (canvasRef.current?.offsetLeft || 0);
        const clickY = e.pageY - (canvasRef.current?.offsetTop || 0);
        const xCell = Math.floor(clickX / cellSize);
        const yCell = Math.floor(clickY / cellSize);

        setGrid(changeGridCell(grid, xCell, yCell, !grid[yCell][xCell]));
      },
    [grid]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        paintGrid(grid, ctx);
      }
    }
  }, [grid, canvasRef]);

  useEffect(() => {
    const currRef = canvasRef.current;
    currRef?.addEventListener('click', onCanvasPressed);

    return () => {
      currRef?.removeEventListener('click', onCanvasPressed);
    };
  }, [canvasRef, onCanvasPressed]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_RESOLUTION}
      height={CANVAS_RESOLUTION}
      className="[image-rendering:pixelated] aspect-square"
    />
  );
};

export default GolCanvas;
