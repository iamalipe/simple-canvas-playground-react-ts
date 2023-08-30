import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./SideBar";
import { RouteNames } from "../types";
import { Outlet, Navigate } from "react-router-dom";
import { SettingModal } from "../components/modals";
import { firebaseAuth } from "../hooks";
import { useEffect } from "react";
import GlobalLoading from "./GlobalLoading";
import { useAtom } from "jotai";
import { globalLoadingAtom } from "../state";

const ProtectedLayout = () => {
  const [globalLoadingState, setGlobalLoadingState] =
    useAtom(globalLoadingAtom);

  useEffect(() => {
    setTimeout(() => {
      setGlobalLoadingState(false);
    }, 750);
  }, [setGlobalLoadingState]);

  const withLayout = (
    <>
      <GlobalLoading />
      <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
        <SettingModal />
        <Header />
        <div className="flex-1 w-full flex overflow-hidden sm:overflow-auto">
          <Sidebar />
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );

  if (globalLoadingState) return <GlobalLoading />;

  return firebaseAuth.currentUser !== null ? (
    withLayout
  ) : (
    <Navigate to={RouteNames.LOGIN} />
  );
};
export default ProtectedLayout;
