import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedLayout from "../layout/ProtectedLayout";
import { RouteNames } from "../types";
import PublicLayout from "../layout/PublicLayout";
import Login from "../pages/common/Login";
import Signup from "../pages/common/Signup";
import Home from "../pages/Home/Home";
import Verify from "../pages/common/Verify";
import SnakeGame from "../pages/SnakeGame/SnakeGame";

const RoutesConfig = () => {
  return (
    <Routes>
      {/* All Protected Routes*/}
      <Route element={<ProtectedLayout />}>
        <Route path={RouteNames.HOME} element={<Home />} />
        <Route path={RouteNames.SNAKEGAME} element={<SnakeGame />} />
      </Route>
      <Route element={<PublicLayout />}>
        {/* All Normal Routes */}
        <Route path={RouteNames.LOGIN} element={<Login />} />
        <Route path={RouteNames.VERIFY} element={<Verify />} />
        <Route path={RouteNames.SIGNUP} element={<Signup />} />
        <Route path={"*"} element={<Navigate to={RouteNames.HOME} />} />
      </Route>
    </Routes>
  );
};

export default RoutesConfig;
