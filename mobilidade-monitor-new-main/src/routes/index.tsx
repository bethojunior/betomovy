import { useContext, FC } from "react";
import AuthContext from "../contexts/auth";
import SignRoutes from "./SignRoutes";
import LoggedRoutes from "./LoggedRoutes";

const Routes: FC = () => {
  const { signed, authInitialized } = useContext(AuthContext);

  if (!authInitialized) return null;

  return signed ? <LoggedRoutes /> : <SignRoutes />;
};

export default Routes;
