import { useEffect, useRef } from 'react';
import { paintGrid } from './Utilities/GridUtilities';

const CANVAS_RESOLUTION = 625;

type GolCanvasProps = {
  grid: boolean[][];
  onCellClicked: (xCell: number, yCell: number) => void;
};

const GolCanvas = ({ grid, onCellClicked }: GolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCanvasClicked = (e: MouseEvent): void => {
    const cellSize = (e.target as HTMLCanvasElement).width / grid.length;
    const clickX = e.pageX - ((e.target as HTMLCanvasElement).offsetLeft || 0);
    const clickY = e.pageY - ((e.target as HTMLCanvasElement).offsetTop || 0);
    const xCell = Math.floor(clickX / cellSize);
    const yCell = Math.floor(clickY / cellSize);

    onCellClicked(xCell, yCell);
  }

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
    currRef?.addEventListener('click', onCanvasClicked);

    return () => {
      currRef?.removeEventListener('click', onCanvasClicked);
    };
  }, [canvasRef, onCanvasClicked]);

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
