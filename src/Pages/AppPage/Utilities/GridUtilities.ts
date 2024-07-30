export const createGrid = (size: number): boolean[][] => {
  const grid: boolean[][] = Array<boolean[]>();

  for (let iter = 0; iter < size; iter++) {
    grid.push(Array<boolean>(size).fill(false));
  }

  return grid;
};

export const copyGrid = (grid: boolean[][]): boolean[][] => {
  const copyGrid: boolean[][] = [];

  for (let row = 0; row < grid.length; row++) {
    const newRow: boolean[] = [];
    copyGrid.push(newRow);

    for (let col = 0; col < grid[row].length; col++) {
      newRow.push(grid[row][col]);
    }
  }

  return copyGrid;
};

export const changeGridCell = (
  grid: boolean[][],
  cellX: number,
  cellY: number,
  value: boolean
): boolean[][] => {
  const newGrid: boolean[][] = copyGrid(grid);
  newGrid[cellY][cellX] = value;

  return newGrid;
};
