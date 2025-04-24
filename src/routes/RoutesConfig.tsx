import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "../layout/ProtectedLayout";
import { RouteNames } from "../types";
import Home from "../pages/Home/Home";
import SnakeGame from "../pages/SnakeGame/SnakeGame";
import GenerateMaze from "../pages/GenerateMaze/GenerateMaze";
import TestMe from "../pages/TestMe/TestMe";
import PathFinding from "../pages/PathFindingX/PathFinding";
import VirtualWorld from "../pages/VirtualWorld/VirtualWorld";
import SelfDrivingCar from "../pages/SelfDrivingCar/SelfDrivingCar";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* All Protected Routes*/}
      <Route element={<ProtectedLayout />}>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SNAKEGAME} element={<SnakeGame />} />
        <Route path={RouteNames.GENERATE_MAZE} element={<GenerateMaze />} />
        <Route path={RouteNames.PATHFINDING} element={<PathFinding />} />
        <Route path={RouteNames.VIRTUALWORLD} element={<VirtualWorld />} />
        <Route path={RouteNames.SELFDRIVINGCAR} element={<SelfDrivingCar />} />
        {import.meta.env.DEV && (
          <Route path={RouteNames.TEST} element={<TestMe />} />
        )}
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
