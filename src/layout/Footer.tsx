const Footer = () => {
  return (
    <>
      <footer className="w-full bg-base-100 border-t border-t-neutral flex-none h-6 overflow-auto text-xs md:text-sm flex items-center justify-between px-2 md:px-12">
        <span className="font-medium">
          Build by{" "}
          <a
            href="https://github.com/iamalipe"
            className="daisy-link-accent font-bold"
          >
            Abhiseck Bhattacharya
          </a>
        </span>
        <span className="font-medium">
          Source code on{" "}
          <a
            href="https://github.com/iamalipe/simple-canvas-playground-react-ts"
            className="daisy-link-accent font-bold"
          >
            Github
          </a>
        </span>
      </footer>
    </>
  );
};
export default Footer;
