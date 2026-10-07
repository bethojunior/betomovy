import { FC, ReactElement, useContext } from "react";
import { Redirect } from "react-router-dom";
import Menu from "../Menu/Body";
import AuthContext from "../../contexts/auth";

export interface PermissionRouteGuardProps {
  readonly group: string;
  readonly permission?: string | null;
  /** Se informado, permite acesso quando qualquer permissão do grupo for verdadeira (ignora `permission`). */
  readonly anyOfPermissions?: readonly string[];
  readonly titlePage: string;
  readonly children: ReactElement;
  readonly redirectTo?: string;
}

export const PermissionRouteGuard: FC<PermissionRouteGuardProps> = ({
  group,
  permission = null,
  anyOfPermissions,
  titlePage,
  children,
  redirectTo = "/",
}) => {
  const { hasPermission } = useContext(AuthContext);
  const isAllowed =
    anyOfPermissions && anyOfPermissions.length > 0
      ? anyOfPermissions.some((name) => hasPermission(group, name))
      : hasPermission(group, permission ?? null);
  if (!isAllowed) {
    return <Redirect to={redirectTo} />;
  }
  return <Menu titlePage={titlePage}>{children}</Menu>;
};
