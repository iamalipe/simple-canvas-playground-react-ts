const Home = () => {
  return (
    <>
      <div className="flex-1 w-full overflow-auto flex flex-col justify-center items-center">
        <h1 className="normal-case text-xl sm:text-4xl font-medium text-center">
          Welcome to Simple{" "}
          <span className="font-bold text-primary">Canvas Playground</span>
          <p className="text-sm sm:text-lg mt-2 text-center">
            This is an experimental playground where I can learn and test
            various algorithms.
          </p>
        </h1>
      </div>
    </>
  );
};
export default Home;
