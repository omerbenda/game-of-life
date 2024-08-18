import Vector2D from '../../../Types/Vector2D';

export const paintGrid = (
  grid: boolean[][],
  ctx: CanvasRenderingContext2D,
  canvasResolution: number,
  cellSize: number,
  position: Vector2D
): void => {
  ctx.fillStyle = 'rgb(0, 3, 69)';
  ctx.fillRect(0, 0, canvasResolution, canvasResolution);
  const cellsInRes = canvasResolution / cellSize;
  const centerPad = Math.floor(cellsInRes / 2) - Math.floor(grid.length / 2);
  const xPad = centerPad - position.x;
  const yPad = centerPad - position.y;

  for (let row = 0; row < grid.length; row++) {
    const startY = (row + yPad) * cellSize;
    const gridRow = grid[row];

    for (let col = 0; col < grid.length; col++) {
      const startX = (col + xPad) * cellSize;

      ctx.fillStyle = gridRow[col] ? 'white' : 'black';
      ctx.fillRect(startX, startY, cellSize, cellSize);
    }
  }
};

export const paintGridLines = (
  ctx: CanvasRenderingContext2D,
  canvasResolution: number,
  cellSize: number
): void => {
  ctx.strokeStyle = 'white';
  const cellsInRes = canvasResolution / cellSize;

  for (let row = 1; row < cellsInRes; row++) {
    ctx.beginPath();
    ctx.moveTo(0, row * cellSize);
    ctx.lineTo(canvasResolution, row * cellSize);
    ctx.stroke();
  }

  for (let col = 1; col < cellsInRes; col++) {
    ctx.beginPath();
    ctx.moveTo(col * cellSize, 0);
    ctx.lineTo(col * cellSize, canvasResolution);
    ctx.stroke();
  }
};

export const getGridCell = (
  canvasPoint: Vector2D,
  canvasResolution: number,
  gridLength: number,
  cellSize: number,
  position: Vector2D
): Vector2D => {
  const cellsInRes = canvasResolution / cellSize;
  const halfPad = Math.floor(cellsInRes / 2) - Math.floor(gridLength / 2);

  const xCell = Math.floor(canvasPoint.x / cellSize) - halfPad + position.x;
  const yCell = Math.floor(canvasPoint.y / cellSize) - halfPad + position.y;

  return { x: xCell, y: yCell };
};
