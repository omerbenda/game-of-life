import { useEffect, useMemo, useRef, useState } from 'react';
import {
  changeGridCell,
  createGrid,
  paintGrid,
} from './Utilities/GridUtilities';
import { createNextGen } from './Utilities/GolUtilities';

const DEFAULT_GRID_SIZE = 50;
const CANVAS_RESOLUTION = 625;
const DEFAULT_GENERATION_INTERVAL = 1000;

type GolCanvasProps = {
  playing: boolean;
};

const GolCanvas = ({ playing }: GolCanvasProps) => {
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

        setGrid((currGrid) =>
          changeGridCell(currGrid, xCell, yCell, !grid[yCell][xCell])
        );
      },
    [grid]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        paintGrid(grid, ctx, canvasRef.current.width);
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

  useEffect(() => {
    if (playing) {
      const generationTimer = setInterval(() => {
        setGrid(createNextGen);
      }, DEFAULT_GENERATION_INTERVAL);

      return () => {
        clearInterval(generationTimer);
      };
    }
  }, [playing]);

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
