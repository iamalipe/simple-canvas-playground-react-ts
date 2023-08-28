const Footer = () => {
  return (
    <>
      <footer className="w-full bg-base-100 border-t border-t-neutral flex-none h-6 overflow-auto text-xs md:text-sm flex items-center justify-center px-2 md:px-12">
        <div>
          <span className="font-medium">
            This is a preview build. Go to{" "}
            <a className="daisy-link-accent font-bold">Github</a> to learn more.
          </span>
        </div>
        {/* <div>
          <a className="daisy-link-accent" href="#">
            Github
          </a>
        </div> */}
      </footer>
    </>
  );
};
export default Footer;
