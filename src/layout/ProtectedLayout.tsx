import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./SideBar";
import { RouteNames } from "../types";
import { Outlet, Navigate } from "react-router-dom";
import { SettingModal } from "../components/modals";

const ProtectedLayout = () => {
  const isAuth = true;

  const withLayout = (
    <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
      <SettingModal />
      <Header />
      <div className="flex-1 w-full flex overflow-hidden sm:overflow-auto">
        <Sidebar />
        <Outlet />
      </div>
      <Footer />
    </div>
  );

  return isAuth ? withLayout : <Navigate to={RouteNames.LOGIN} />;
};
export default ProtectedLayout;
