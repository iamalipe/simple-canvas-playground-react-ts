import { ThemeChangeButton } from "../components/buttons";

const Header = () => {
  const onToggle = () => {
    const ele = document.getElementById("side-bar-toggle");
    if (ele) ele.click();
  };

  return (
    <>
      <div className="w-full bg-base-100 border-b border-b-neutral flex-none h-12 flex overflow-auto items-center px-2 md:px-12">
        <h1 className="normal-case text-lg sm:text-xl font-medium whitespace-nowrap">
          Simple{" "}
          <span className="font-bold text-primary">Canvas Playground</span>
        </h1>
        <div className="flex items-center ml-auto">
          <button
            onClick={onToggle}
            className="daisy-btn daisy-btn-accent daisy-btn-sm mr-4"
          >
            Side Bar
          </button>
          <ThemeChangeButton />
        </div>
      </div>
    </>
  );
};
export default Header;
