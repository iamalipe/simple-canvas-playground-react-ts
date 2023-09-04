import { useState } from "react";
import { RouteNames } from "../types";
import { useNavigate } from "react-router-dom";
import { SNAKEGAME_VERSION } from "../pages/SnakeGame/SnakeGame";
import { GENERATE_MAZE_VERSION } from "../pages/GenerateMaze/GenerateMaze";

const PROGRAM_LIST = [
  {
    title: "Snake Game " + SNAKEGAME_VERSION,
    sub: "Start: 30/08/2023 End: 03/09/2023",
    path: RouteNames.SNAKEGAME,
  },
  {
    title: "Generate Maze " + GENERATE_MAZE_VERSION,
    sub: "Start: 03/09/2023 End: ",
    path: RouteNames.GENERATE_MAZE,
  },
];

import.meta.env.DEV &&
  PROGRAM_LIST.push({
    title: "Test Me",
    sub: "This only work on DEV",
    path: RouteNames.TEST,
  });

const Sidebar = () => {
  const [filterList, setFilterList] = useState(PROGRAM_LIST);

  const onSearchValueChange = (value: string) => {
    setFilterList(
      PROGRAM_LIST.filter((e) => e.title.toLowerCase().includes(value))
    );
  };

  return (
    <>
      <input type="checkbox" id="side-bar-toggle" className="hidden" />
      <div className="side-nav-toggle-target flex-none w-full sm:w-[280px] bg-base-100 border-x border-x-base-200 overflow-auto transition-[width] duration-1000 flex flex-col">
        <div className="flex-none bg-base-200 h-12 flex items-center">
          <input
            onChange={(e) => onSearchValueChange(e.target.value)}
            type="text"
            placeholder="Search programs"
            className="daisy-input daisy-input-sm daisy-input-bordered mx-2 flex-1 min-w-0 transition-all duration-1000  mr-12 ml-2 sm:mr-2"
          />
          <label
            htmlFor="side-bar-toggle"
            className="daisy-btn daisy-btn-square daisy-btn-sm daisy-btn-neutral side-nav-toggle-button absolute sm:relative sm:hidden transition-[left] duration-1000"
          >
            <svg
              className="h-5 w-5"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M2 5.99519C2 5.44556 2.44556 5 2.99519 5H11.0048C11.5544 5 12 5.44556 12 5.99519C12 6.54482 11.5544 6.99039 11.0048 6.99039H2.99519C2.44556 6.99039 2 6.54482 2 5.99519Z"
                fill="currentColor"
              />
              <path
                d="M2 11.9998C2 11.4501 2.44556 11.0046 2.99519 11.0046H21.0048C21.5544 11.0046 22 11.4501 22 11.9998C22 12.5494 21.5544 12.9949 21.0048 12.9949H2.99519C2.44556 12.9949 2 12.5494 2 11.9998Z"
                fill="currentColor"
              />
              <path
                d="M2.99519 17.0096C2.44556 17.0096 2 17.4552 2 18.0048C2 18.5544 2.44556 19 2.99519 19H15.0048C15.5544 19 16 18.5544 16 18.0048C16 17.4552 15.5544 17.0096 15.0048 17.0096H2.99519Z"
                fill="currentColor"
              />
            </svg>
          </label>
        </div>
        <div className="overflow-auto transition-all duration-1000 scroll-smooth h-0 flex-1">
          {filterList.map((e, index) => (
            <RenderProgramList key={index} data={e} />
          ))}
        </div>
      </div>
    </>
  );
};
export default Sidebar;

interface RenderProgramListProps {
  data: {
    title: string;
    sub: string;
    path: RouteNames;
  };
}
const RenderProgramList: React.FC<RenderProgramListProps> = ({ data }) => {
  const navigate = useNavigate();

  const onOpenProgram = () => {
    const ele = document.getElementById("side-bar-toggle");
    if (ele) ele.click();
    navigate(data.path);
  };

  return (
    <>
      <div
        onClick={onOpenProgram}
        className="cursor-pointer flex-none flex h-16 px-2 py-1 text-sm border-y border-y-base-200 hover:bg-base-300 hover:border-y-base-300"
      >
        <div className="flex-1 flex flex-col justify-center whitespace-nowrap overflow-hidden ml-2">
          <div className="font-medium">{data.title}</div>
          <span className="font-light">{data.sub}</span>
        </div>
      </div>
    </>
  );
};
