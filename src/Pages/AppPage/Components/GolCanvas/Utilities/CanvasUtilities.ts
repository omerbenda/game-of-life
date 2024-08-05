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
  const halfResCells = Math.floor(cellsInRes / 2);
  const halfGrid = Math.floor(grid.length / 2);

  for (let row = 0; row < grid.length && row < grid.length; row++) {
    for (let col = 0; col < grid.length && col < grid.length; col++) {
      const startX = (col + halfResCells - halfGrid - position.x) * cellSize;
      const startY = (row + halfResCells - halfGrid - position.y) * cellSize;

      ctx.fillStyle = grid[row][col] ? 'white' : 'black';
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
