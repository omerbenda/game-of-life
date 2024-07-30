import Position from '../../../Types/Position';

export const paintGrid = (
  grid: boolean[][],
  ctx: CanvasRenderingContext2D,
  canvasResolution: number,
  cellSize: number,
  position: Position
): void => {
  ctx.fillRect(0, 0, canvasResolution, canvasResolution);
  const cellsInRes = canvasResolution / cellSize;

  for (let row = position.x; row < cellsInRes && row < grid.length; row++) {
    for (
      let col = position.y;
      col < cellsInRes && col < grid[row].length;
      col++
    ) {
      const startX = (col - position.x) * cellSize;
      const startY = (row - position.y) * cellSize;

      ctx.fillStyle = grid[row][col] ? 'white' : 'black';
      ctx.fillRect(startX, startY, cellSize, cellSize);
    }
  }
};
