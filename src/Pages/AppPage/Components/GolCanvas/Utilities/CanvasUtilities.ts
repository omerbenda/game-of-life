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

  for (
    let row = Math.max(position.y, 0);
    row < cellsInRes + position.y && row < grid.length;
    row++
  ) {
    for (
      let col = Math.max(position.x, 0);
      col < cellsInRes + position.x && col < grid[row].length;
      col++
    ) {
      const startX = (col - position.x) * cellSize;
      const startY = (row - position.y) * cellSize;

      ctx.fillStyle = grid[row][col] ? 'white' : 'black';
      ctx.fillRect(startX, startY, cellSize, cellSize);
    }
  }
};
