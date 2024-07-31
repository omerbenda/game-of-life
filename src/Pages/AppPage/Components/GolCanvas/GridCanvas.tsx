import { useEffect, useMemo, useRef } from 'react';
import { paintGrid } from './Utilities/CanvasUtilities';
import Vector2D from '../../Types/Vector2D';

const CANVAS_RESOLUTION = 625;
const CELL_SIZE = 25;
const DRAG_BUTTON = 2;

type GolCanvasProps = {
  grid: boolean[][];
  position: Vector2D;
  onCellClicked: (xCell: number, yCell: number) => void;
  onPosDrag: (newPosition: Vector2D) => void;
};

const GridCanvas = ({
  grid,
  position,
  onCellClicked,
  onPosDrag,
}: GolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<Vector2D>({ x: 0, y: 0 });

  const onCanvasClicked = useMemo(
    () =>
      (e: MouseEvent): void => {
        const clickX =
          e.pageX - ((e.target as HTMLCanvasElement).offsetLeft || 0);
        const clickY =
          e.pageY - ((e.target as HTMLCanvasElement).offsetTop || 0);
        const xCell = Math.floor(clickX / CELL_SIZE) + position.x;
        const yCell = Math.floor(clickY / CELL_SIZE) + position.y;

        if (
          xCell < grid.length &&
          xCell >= 0 &&
          yCell < grid[0]?.length &&
          yCell >= 0
        ) {
          onCellClicked(xCell, yCell);
        }
      },
    [grid, position, onCellClicked]
  );

  const onMouseDown = useMemo(
    () =>
      (e: MouseEvent): void => {
        if (e.button === DRAG_BUTTON && canvasRef.current) {
          dragStart.current = {
            x:
              e.clientX - canvasRef.current.offsetLeft + position.x * CELL_SIZE,
            y: e.clientY - canvasRef.current.offsetTop + position.y * CELL_SIZE,
          };

          isDragging.current = true;
        }
      },
    [position]
  );

  const onMouseMove = useMemo(
    () =>
      (e: MouseEvent): void => {
        if (isDragging.current && canvasRef.current) {
          const xCanvas = e.clientX - canvasRef.current.offsetLeft;
          const yCanvas = e.clientY - canvasRef.current.offsetTop;
          const xDiff = (dragStart.current.x - xCanvas) / CELL_SIZE;
          const yDiff = (dragStart.current.y - yCanvas) / CELL_SIZE;

          onPosDrag({
            x: Math.floor(xDiff),
            y: Math.floor(yDiff),
          });
        }
      },
    [onPosDrag]
  );

  const onMouseUp = useMemo(
    () =>
      (e: MouseEvent): void => {
        if (e.button === DRAG_BUTTON) {
          isDragging.current = false;
        }
      },
    []
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
    currRef?.addEventListener('mousedown', onMouseDown);
    currRef?.addEventListener('mousemove', onMouseMove);
    currRef?.addEventListener('mouseup', onMouseUp);

    return () => {
      currRef?.removeEventListener('click', onCanvasClicked);
      currRef?.removeEventListener('mousedown', onMouseDown);
      currRef?.removeEventListener('mousemove', onMouseMove);
      currRef?.removeEventListener('mouseup', onMouseUp);
    };
  }, [canvasRef, onCanvasClicked, onMouseDown, onMouseMove, onMouseUp]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_RESOLUTION}
      height={CANVAS_RESOLUTION}
      onContextMenu={(e) => e.preventDefault()}
      className="[image-rendering:pixelated] aspect-square"
    />
  );
};

export default GridCanvas;
