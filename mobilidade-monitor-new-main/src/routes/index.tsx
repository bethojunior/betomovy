import { useContext, FC } from "react";
import AuthContext from "../contexts/auth";
import SignRoutes from "./SignRoutes";
import LoggedRoutes from "./LoggedRoutes";
import { Loader } from "../components/Loader";

const Routes: FC = () => {
  const { signed, authInitialized } = useContext(AuthContext);

  if (!authInitialized) return <Loader spinning />;

  return signed ? <LoggedRoutes /> : <SignRoutes />;
};

export default Routes;
