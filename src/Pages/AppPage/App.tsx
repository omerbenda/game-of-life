import { useEffect, useState } from 'react';
import GridCanvas from './Components/GridCanvas/GridCanvas';
import { changeGridCell, createGrid } from './Utilities/GridUtilities';
import { createNextGen } from './Utilities/GolUtilities';
import Vector2D from './Types/Vector2D';

const DEFAULT_GRID_SIZE = 100;
const DEFAULT_GENERATION_INTERVAL = 100;
const MIN_GEN_INTERVAL = 5;
const DEFAULT_ZOOM = 1;
const MAX_ZOOM = 31;

const AppPage = () => {
  const [grid, setGrid] = useState<boolean[][]>(createGrid(DEFAULT_GRID_SIZE));
  const [position, setPosition] = useState<Vector2D>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState<number>(DEFAULT_ZOOM);
  const [playing, setPlaying] = useState<boolean>(false);
  const [genInterval, setGenInterval] = useState<number>(
    DEFAULT_GENERATION_INTERVAL,
  );

  const onCellClicked = (cellPos: Vector2D): void => {
    setGrid((currGrid) =>
      changeGridCell(
        currGrid,
        cellPos.x,
        cellPos.y,
        !grid[cellPos.y][cellPos.x],
      ),
    );
  };

  const onZoom = (zoomValue: number): void => {
    setZoom((currZoom) => Math.max(currZoom - zoomValue, 1));
  };

  useEffect(() => {
    if (playing) {
      const generationTimer = setInterval(() => {
        setGrid(createNextGen);
      }, genInterval);

      return () => {
        clearInterval(generationTimer);
      };
    }
  }, [playing, genInterval]);

  return (
    <div className="flex flex-col h-full bg-gray-300">
      <div className="flex items-center bg-gray-600 h-16 md:h-24 px-6">
        <div className="text-white text-2xl md:text-4xl font-bold">
          Game of Life
        </div>
      </div>
      <div className="flex flex-col flex-grow relative overflow-hidden">
        <div className="flex justify-center items-center w-full h-full p-2 md:p-10">
          <div className="flex justify-center border-2 border-black bg-gray-600 w-full max-w-[650px] aspect-square shadow-2xl">
            <GridCanvas
              grid={grid}
              position={position}
              zoom={zoom}
              onCellClicked={onCellClicked}
              onPosDrag={setPosition}
              onZoom={onZoom}
            />
          </div>
        </div>
      </div>
      <div className="flex flex-col justify-center items-center p-4 bg-gray-200 gap-4 border-t border-gray-400">
        <div className="flex flex-wrap justify-center gap-6 w-full max-w-2xl">
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase text-gray-600">
              Interval (ms)
            </span>
            <input
              type="range"
              className="w-32 md:w-48"
              value={genInterval}
              onChange={(e) => setGenInterval(parseInt(e.target.value))}
              min={MIN_GEN_INTERVAL}
              max={1000}
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <span className="text-xs font-bold uppercase text-gray-600">
              Zoom
            </span>
            <input
              type="range"
              className="w-32 md:w-48"
              value={zoom}
              min={DEFAULT_ZOOM}
              max={MAX_ZOOM}
              onChange={(e) => setZoom(parseInt(e.target.value))}
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setGrid(createGrid(DEFAULT_GRID_SIZE))}
            className="bg-red-500 active:bg-red-700 text-white font-bold rounded-lg py-3 px-8 transition-colors"
          >
            Reset
          </button>
          <button
            onClick={() => setPlaying((curr) => !curr)}
            className={`${playing ? 'bg-orange-500' : 'bg-green-600'} text-white font-bold rounded-lg py-3 px-8 transition-colors`}
          >
            {playing ? 'Stop' : 'Play'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
