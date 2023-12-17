import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Navigate, Outlet } from "react-router-dom";
import GlobalLoading from "./GlobalLoading";
import { globalLoadingAtom } from "../state";
import { useAtom } from "jotai";
import { useEffect } from "react";
import { RouteNames } from "../types";
import { firebaseAuth } from "../hooks";

const PublicLayout = () => {
  const [globalLoadingState, setGlobalLoadingState] =
    useAtom(globalLoadingAtom);

  useEffect(() => {
    setTimeout(() => {
      setGlobalLoadingState(false);
    }, 750);
  }, [setGlobalLoadingState]);

  if (globalLoadingState) return <GlobalLoading />;

  const withLayout = (
    <>
      <GlobalLoading />
      <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
        <Header />
        <div className="flex-1 w-full flex overflow-auto">
          <Outlet />
        </div>
        <Footer />
      </div>
    </>
  );

  return <Navigate to={RouteNames.HOME} />;

  return firebaseAuth.currentUser === null ? (
    withLayout
  ) : (
    <Navigate to={RouteNames.HOME} />
  );
};
export default PublicLayout;
