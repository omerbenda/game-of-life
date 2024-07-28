import { createGrid } from './GridUtilities';

export const createNextGen = (grid: boolean[][]): boolean[][] => {
  const newGrid: boolean[][] = createGrid(grid.length);

  for (let row = 0; row < newGrid.length; row++) {
    for (let col = 0; col < newGrid[row].length; col++) {
      const neighborCount = getNeighborCount(grid, col, row);

      if (neighborCount < 2 || neighborCount > 3) {
        newGrid[row][col] = false;
      } else if (grid[row][col]) {
        newGrid[row][col] = true;
      } else if (neighborCount === 3) {
        newGrid[row][col] = true;
      }
    }
  }

  return newGrid;
};

export const getNeighborCount = (
  grid: boolean[][],
  cellX: number,
  cellY: number
): number => {
  let neighbors = 0;

  if (cellX > 0 && grid[cellY][cellX - 1]) {
    neighbors++;
  }

  if (cellX < grid.length - 1 && grid[cellY][cellX + 1]) {
    neighbors++;
  }

  if (cellY > 0) {
    if (cellX > 0 && grid[cellY - 1][cellX - 1]) {
      neighbors++;
    }
    if (grid[cellY - 1][cellX]) {
      neighbors++;
    }
    if (cellX < grid.length - 1 && grid[cellY - 1][cellX + 1]) {
      neighbors++;
    }
  }

  if (cellY < grid.length - 1) {
    if (cellX > 0 && grid[cellY + 1][cellX - 1]) {
      neighbors++;
    }
    if (grid[cellY + 1][cellX]) {
      neighbors++;
    }
    if (cellX < grid.length - 1 && grid[cellY + 1][cellX + 1]) {
      neighbors++;
    }
  }

  return neighbors;
};
