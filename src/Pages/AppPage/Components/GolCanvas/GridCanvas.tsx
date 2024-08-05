import { useEffect, useMemo, useRef } from 'react';
import {
  getGridCell,
  paintGrid,
  paintGridLines,
} from './Utilities/CanvasUtilities';
import Vector2D from '../../Types/Vector2D';

const CANVAS_RESOLUTION = 650;
const DEFAULT_CELL_SIZE = 20;
const DRAG_BUTTON = 2;
const ZOOM_PER_WHEEL = 1;

type GolCanvasProps = {
  grid: boolean[][];
  position: Vector2D;
  zoom: number;
  onCellClicked: (cellPos: Vector2D) => void;
  onPosDrag: (newPosition: Vector2D) => void;
  onZoom: (zoomValue: number) => void;
};

const GridCanvas = ({
  grid,
  position,
  zoom,
  onCellClicked,
  onPosDrag,
  onZoom,
}: GolCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const dragStart = useRef<Vector2D>({ x: 0, y: 0 });

  //#region Mouse Events

  const onCanvasClicked = useMemo(
    () =>
      (e: MouseEvent): void => {
        if (canvasRef.current) {
          e.preventDefault();
          const cellSize = DEFAULT_CELL_SIZE * zoom;

          const clickX =
            e.pageX - ((e.target as HTMLCanvasElement).offsetLeft || 0);
          const clickY =
            e.pageY - ((e.target as HTMLCanvasElement).offsetTop || 0);

          const gridCell = getGridCell(
            { x: clickX, y: clickY },
            canvasRef.current?.width,
            grid.length,
            cellSize,
            position
          );

          if (
            gridCell.x < grid.length &&
            gridCell.x >= 0 &&
            gridCell.y < grid[0]?.length &&
            gridCell.y >= 0
          ) {
            onCellClicked(gridCell);
          }
        }
      },
    [grid, position, zoom, canvasRef, onCellClicked]
  );

  const onMouseDown = useMemo(
    () =>
      (e: MouseEvent): void => {
        const cellSize = DEFAULT_CELL_SIZE * zoom;

        if (e.button === DRAG_BUTTON && canvasRef.current) {
          dragStart.current = {
            x: e.clientX - canvasRef.current.offsetLeft + position.x * cellSize,
            y: e.clientY - canvasRef.current.offsetTop + position.y * cellSize,
          };

          isDragging.current = true;
        }
      },
    [position, zoom]
  );

  const onMouseMove = useMemo(
    () =>
      (e: MouseEvent): void => {
        const cellSize = DEFAULT_CELL_SIZE * zoom;

        if (isDragging.current && canvasRef.current) {
          const xCanvas = e.clientX - canvasRef.current.offsetLeft;
          const yCanvas = e.clientY - canvasRef.current.offsetTop;
          const xDiff = (dragStart.current.x - xCanvas) / cellSize;
          const yDiff = (dragStart.current.y - yCanvas) / cellSize;

          onPosDrag({
            x: Math.floor(xDiff),
            y: Math.floor(yDiff),
          });
        }
      },
    [zoom, onPosDrag]
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

  const onWheel = useMemo(
    () =>
      (e: WheelEvent): void => {
        e.preventDefault();

        if (e.deltaY > 0) {
          onZoom(ZOOM_PER_WHEEL);
        } else if (e.deltaY < 0) {
          onZoom(-ZOOM_PER_WHEEL);
        }
      },
    [onZoom]
  );

  //#endregion

  useEffect(() => {
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');

      if (ctx) {
        paintGrid(
          grid,
          ctx,
          canvasRef.current.width,
          DEFAULT_CELL_SIZE * zoom,
          position
        );
        paintGridLines(ctx, canvasRef.current.width, DEFAULT_CELL_SIZE * zoom);
      }
    }
  }, [grid, position, zoom, canvasRef]);

  useEffect(() => {
    const currRef = canvasRef.current;
    currRef?.addEventListener('click', onCanvasClicked);
    currRef?.addEventListener('mousedown', onMouseDown);
    currRef?.addEventListener('mousemove', onMouseMove);
    currRef?.addEventListener('mouseup', onMouseUp);
    currRef?.addEventListener('wheel', onWheel);

    return () => {
      currRef?.removeEventListener('click', onCanvasClicked);
      currRef?.removeEventListener('mousedown', onMouseDown);
      currRef?.removeEventListener('mousemove', onMouseMove);
      currRef?.removeEventListener('wheel', onWheel);
    };
  }, [
    canvasRef,
    onCanvasClicked,
    onMouseDown,
    onMouseMove,
    onMouseUp,
    onWheel,
  ]);

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
