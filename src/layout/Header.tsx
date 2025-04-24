import { ThemeChangeButton } from "../components/buttons";

const Header = () => {
  return (
    <>
      <div className="w-full bg-base-100 border-b border-b-neutral flex-none h-12 flex overflow-auto items-center px-2 md:px-12">
        <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
          Simple{" "}
          <span className="font-bold text-primary">Canvas Playground</span>
        </h1>
        <ThemeChangeButton />
      </div>
    </>
  );
};
export default Header;
