import GolCanvas from './Components/GolCanvas/GolCanvas';

const AppPage = () => {
  return (
    <div className="flex flex-col h-full bg-gray-300">
      <div className="flex items-center bg-gray-600 h-32">
        <div className="w-8" />
        <div className="text-white text-4xl">Game of Life</div>
      </div>
      <div className="flex flex-col flex-grow">
        <div className="flex justify-center items-center flex-grow w-full">
          <div className="border-2 border-black bg-white w-3/4 h-3/4">
            <GolCanvas />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppPage;
