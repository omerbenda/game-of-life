import { useEffect, useMemo, useRef } from 'react';
import { paintGrid } from './Utilities/GridUtilities';
import Position from './Types/Position';

const CANVAS_RESOLUTION = 625;
const CELL_SIZE = 25;

type GolCanvasProps = {
  grid: boolean[][];
  position: Position;
  onCellClicked: (xCell: number, yCell: number) => void;
};

const GridCanvas = ({ grid, position, onCellClicked }: GolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const onCanvasClicked = useMemo(
    () =>
      (e: MouseEvent): void => {
        const clickX =
          e.pageX - ((e.target as HTMLCanvasElement).offsetLeft || 0);
        const clickY =
          e.pageY - ((e.target as HTMLCanvasElement).offsetTop || 0);
        const xCell = Math.floor(clickX / CELL_SIZE) + position.x;
        const yCell = Math.floor(clickY / CELL_SIZE) + position.y;

        onCellClicked(xCell, yCell);
      },
    [position, onCellClicked]
  );

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        paintGrid(grid, ctx, canvasRef.current.width, CELL_SIZE, position);
      }
    }
  }, [grid, position, canvasRef]);

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

export default GridCanvas;
