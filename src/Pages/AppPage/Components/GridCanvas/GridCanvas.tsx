import { useEffect, useCallback, useRef } from 'react';
import {
  getGridCell,
  paintGrid,
  paintGridLines,
} from './Utilities/CanvasUtilities';
import Vector2D from '../../Types/Vector2D';

const CANVAS_RESOLUTION = 650;
const DEFAULT_CELL_SIZE = 20;
const ZOOM_PER_WHEEL = 1;

type GridCanvasProps = {
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
}: GridCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDragging = useRef<boolean>(false);
  const lastInteractionPos = useRef<Vector2D>({ x: 0, y: 0 });

  const getNormalizedCanvasPoint = (
    clientX: number,
    clientY: number,
  ): Vector2D => {
    if (!canvasRef.current) return { x: 0, y: 0 };
    const rect = canvasRef.current.getBoundingClientRect();

    const scaleX = CANVAS_RESOLUTION / rect.width;
    const scaleY = CANVAS_RESOLUTION / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const handlePointerDown = (
    clientX: number,
    clientY: number,
    button?: number,
  ) => {
    if (button === 2 || button === undefined) {
      isDragging.current = true;
      lastInteractionPos.current = { x: clientX, y: clientY };
    }
  };

  const handlePointerMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging.current) return;

      const cellSize = DEFAULT_CELL_SIZE * zoom;
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;

      const dx =
        (lastInteractionPos.current.x - clientX) *
        (CANVAS_RESOLUTION / rect.width);
      const dy =
        (lastInteractionPos.current.y - clientY) *
        (CANVAS_RESOLUTION / rect.height);

      if (Math.abs(dx) > cellSize / 2 || Math.abs(dy) > cellSize / 2) {
        onPosDrag({
          x: position.x + Math.round(dx / cellSize),
          y: position.y + Math.round(dy / cellSize),
        });
        lastInteractionPos.current = { x: clientX, y: clientY };
      }
    },
    [onPosDrag, position, zoom],
  );

  const handleClick = (clientX: number, clientY: number) => {
    const canvasPoint = getNormalizedCanvasPoint(clientX, clientY);
    const cellSize = DEFAULT_CELL_SIZE * zoom;

    const gridCell = getGridCell(
      canvasPoint,
      CANVAS_RESOLUTION,
      grid.length,
      cellSize,
      position,
    );

    if (
      gridCell.x >= 0 &&
      gridCell.x < grid.length &&
      gridCell.y >= 0 &&
      gridCell.y < grid[0]?.length
    ) {
      onCellClicked(gridCell);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onMouseDown = (e: MouseEvent) =>
      handlePointerDown(e.clientX, e.clientY, e.button);
    const onMouseMove = (e: MouseEvent) =>
      handlePointerMove(e.clientX, e.clientY);
    const onMouseUp = () => {
      isDragging.current = false;
    };
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      onZoom(e.deltaY > 0 ? ZOOM_PER_WHEEL : -ZOOM_PER_WHEEL);
    };

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      handlePointerDown(touch.clientX, touch.clientY);
    };
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const touch = e.touches[0];
      handlePointerMove(touch.clientX, touch.clientY);
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('touchstart', onTouchStart);
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onMouseUp);
    };
  }, [position, zoom, grid, handlePointerMove, onZoom]);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, CANVAS_RESOLUTION, CANVAS_RESOLUTION);
      paintGrid(
        grid,
        ctx,
        CANVAS_RESOLUTION,
        DEFAULT_CELL_SIZE * zoom,
        position,
      );
      paintGridLines(ctx, CANVAS_RESOLUTION, DEFAULT_CELL_SIZE * zoom);
    }
  }, [grid, position, zoom]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_RESOLUTION}
      height={CANVAS_RESOLUTION}
      onClick={(e) => handleClick(e.clientX, e.clientY)}
      onContextMenu={(e) => e.preventDefault()}
      className="w-full h-full [image-rendering:pixelated] touch-none"
    />
  );
};

export default GridCanvas;
