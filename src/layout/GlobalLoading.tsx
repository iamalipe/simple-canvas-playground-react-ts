import { useAtomValue } from "jotai";
import { globalLoadingAtom } from "../state";

const GlobalLoading = () => {
  const globalLoadingState = useAtomValue(globalLoadingAtom);

  return (
    <div
      style={{ display: globalLoadingState ? "flex" : "none" }}
      className="this-is-loading"
    >
      <h1>Loading</h1>
    </div>
  );
};

export default GlobalLoading;
