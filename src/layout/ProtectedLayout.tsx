import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./SideBar";
import { Outlet } from "react-router-dom";
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
    }, 250);
  }, [setGlobalLoadingState]);

  const withLayout = (
    <>
      <GlobalLoading />
      <div className="mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
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
  return withLayout;
};
export default ProtectedLayout;
