import { useEffect, useMemo, useState } from 'react';
import GridCanvas from './Components/GolCanvas/GridCanvas';
import { changeGridCell, createGrid } from './Utilities/GridUtilities';
import { createNextGen } from './Utilities/GolUtilities';
import Vector2D from './Types/Vector2D';

const DEFAULT_GRID_SIZE = 100;
const DEFAULT_GENERATION_INTERVAL = 100;

const AppPage = () => {
  const [grid, setGrid] = useState<boolean[][]>(createGrid(DEFAULT_GRID_SIZE));
  const [position, setPosition] = useState<Vector2D>({ x: 0, y: 0 });
  const [playing, setPlaying] = useState<boolean>(false);

  const onCellClicked = useMemo(
    () =>
      (cellPos: Vector2D): void => {
        setGrid((currGrid) =>
          changeGridCell(
            currGrid,
            cellPos.x,
            cellPos.y,
            !grid[cellPos.y][cellPos.x]
          )
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
            <GridCanvas
              grid={grid}
              position={position}
              onCellClicked={onCellClicked}
              onPosDrag={setPosition}
            />
          </div>
        </div>
      </div>
      <div className="flex justify-center items-center h-32 gap-5">
        <button
          onClick={() => setGrid(createGrid(DEFAULT_GRID_SIZE))}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold rounded py-2 px-4"
        >
          Reset
        </button>
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
