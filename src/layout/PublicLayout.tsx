import Footer from "../layout/Footer";
import Header from "../layout/Header";
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="container mx-auto h-full relative flex flex-col bg-base-100 text-base-content">
      <Header />
      <div className="flex-1 w-full flex overflow-auto">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};
export default PublicLayout;
