import React from "react";
import { RouteNames } from "../types";
import { useNavigate } from "react-router-dom";

const PROGRAM_LIST = [
  {
    title: "Snake Game",
    sub: "Start: 30/8/2023 End: ",
    path: RouteNames.SNAKEGAME,
  },
];

const Sidebar = () => {
  return (
    <>
      <input type="checkbox" id="side-bar-toggle" className="hidden" />
      <div className="side-nav-toggle-target flex-none w-full sm:w-[240px] md:w-[360px] bg-base-100 border-x border-x-base-200 overflow-auto transition-[width] duration-1000 flex flex-col">
        <div className="flex-none bg-base-200 h-12 flex items-center">
          <input
            // value={searchValue}
            // onChange={onSearchValueChange}
            type="text"
            placeholder="Search programs"
            className="daisy-input daisy-input-sm daisy-input-bordered ml-2 flex-1 min-w-0 transition-all duration-1000 mr-0"
          />
          <button
            // onClick={onSearchClick}
            className="daisy-btn daisy-btn-neutral daisy-btn-sm mr-12 ml-2 sm:mr-2 max-md:daisy-btn-square"
          >
            <svg
              className="h-5 w-5 md:hidden"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.319 14.4326C20.7628 11.2941 20.542 6.75347 17.6569 3.86829C14.5327 0.744098 9.46734 0.744098 6.34315 3.86829C3.21895 6.99249 3.21895 12.0578 6.34315 15.182C9.22833 18.0672 13.769 18.2879 16.9075 15.8442C16.921 15.8595 16.9351 15.8745 16.9497 15.8891L21.1924 20.1317C21.5829 20.5223 22.2161 20.5223 22.6066 20.1317C22.9971 19.7412 22.9971 19.1081 22.6066 18.7175L18.364 14.4749C18.3493 14.4603 18.3343 14.4462 18.319 14.4326ZM16.2426 5.28251C18.5858 7.62565 18.5858 11.4246 16.2426 13.7678C13.8995 16.1109 10.1005 16.1109 7.75736 13.7678C5.41421 11.4246 5.41421 7.62565 7.75736 5.28251C10.1005 2.93936 13.8995 2.93936 16.2426 5.28251Z"
                fill="currentColor"
              />
            </svg>
            <span className="hidden md:block">Search</span>
          </button>
        </div>
        <div className="overflow-auto transition-all duration-1000 scroll-smooth h-0 flex-1">
          {PROGRAM_LIST.map((e, index) => (
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
