import { useFirebaseApp } from "./hooks";
import RoutesConfig from "./routes/RoutesConfig";

const App = () => {
  useFirebaseApp();
  return <RoutesConfig />;
};
export default App;
