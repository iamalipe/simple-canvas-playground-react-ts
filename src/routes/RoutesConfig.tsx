import { Route, Routes } from "react-router-dom";
import ProtectedLayout from "../layout/ProtectedLayout";
import GenerateMaze from "../pages/GenerateMaze/GenerateMaze";
import Home from "../pages/Home/Home";
import PaperIo from "../pages/PaperIo/PaperIo";
import PathFinding from "../pages/PathFindingX/PathFinding";
import SelfDrivingCar from "../pages/SelfDrivingCar/SelfDrivingCar";
import SnakeGame from "../pages/SnakeGame/SnakeGame";
import TestMe from "../pages/TestMe/TestMe";
import VirtualWorld from "../pages/VirtualWorld/VirtualWorld";
import { RouteNames } from "../types";

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
        <Route path={RouteNames.PAPERIO} element={<PaperIo />} />
        {import.meta.env.DEV && (
          <Route path={RouteNames.TEST} element={<TestMe />} />
        )}
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
