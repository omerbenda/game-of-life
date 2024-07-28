import { useEffect, useMemo, useState } from 'react';
import GolCanvas from './Components/GolCanvas/GolCanvas';
import { changeGridCell, createGrid } from './Components/GolCanvas/Utilities/GridUtilities';
import { createNextGen } from './Components/GolCanvas/Utilities/GolUtilities';

const DEFAULT_GRID_SIZE = 25;
const DEFAULT_GENERATION_INTERVAL = 1000;

const AppPage = () => {
  const [grid, setGrid] = useState<boolean[][]>(createGrid(DEFAULT_GRID_SIZE));
  const [playing, setPlaying] = useState<boolean>(false);

  const onCellClicked = useMemo(
    () =>
      (xCell: number, yCell: number): void => {
        setGrid((currGrid) =>
          changeGridCell(currGrid, xCell, yCell, !grid[yCell][xCell])
        );
      },
    [grid]
  );

  useEffect(() => {
    if (playing) {
      const generationTimer = setInterval(() => {
        setGrid(createNextGen);
      }, DEFAULT_GENERATION_INTERVAL);

      return () => {
        clearInterval(generationTimer);
      };
    }
  }, [playing]);

  return (
    <div className="flex flex-col h-full bg-gray-300">
      <div className="flex items-center bg-gray-600 h-32">
        <div className="w-8" />
        <div className="text-white text-4xl">Game of Life</div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-center items-center flex-grow w-full">
          <div className="flex justify-center border-2 border-black bg-gray-600 w-3/4">
            <GolCanvas grid={grid} onCellClicked={onCellClicked} />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-32">
        <button
          onClick={() => setPlaying((curr) => !curr)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
        >
          {playing ? 'Stop' : 'Play'}
        </button>
      </div>
    </div>
  );
};

export default AppPage;
