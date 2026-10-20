import { Group } from "../../../../../../@types/context";
import {
  CENTRAL,
  CENTRAL_SUBMENU_PERMISSIONS,
  CONFIGURACAO,
} from "../../../../../../constants/permissions";
import { TripTypeCategoryVisibility } from "./types";
const PERMISSION_SERVICOS = "adicionar_tipo_servicos";
const PERMISSION_SERVICOS_FALLBACK = "gerenciar_chamado";

function hasPermissionAcrossSameNamedGroups(
  groups: Group[] | undefined,
  groupName: string,
  permissionName: string
): boolean {
  if (!groups?.length) {
    return false;
  }
  return groups.some(
    (item) =>
      item.name?.toLowerCase() === groupName?.toLowerCase() &&
      (!permissionName || item.permissions?.includes(permissionName))
  );
}

export function getTripTypeCategoryVisibility(
  groups: Group[] | undefined,
  hasPermission?: (nameGroup: string, namePermission?: string | null) => boolean,
  user?: any
): TripTypeCategoryVisibility {
  const isRootOrAdmin = Boolean(
    user?.role?.isRoot ||
    user?.role?.name === "Administrador" ||
    user?.role?.name === "admin" ||
    user?.roleId === 1
  );

  const canShowCentral =
    isRootOrAdmin ||
    Boolean(
      hasPermission &&
        (hasPermission(CENTRAL, null) ||
          CENTRAL_SUBMENU_PERMISSIONS.some((perm) => hasPermission(CENTRAL, perm)))
    ) ||
    CENTRAL_SUBMENU_PERMISSIONS.some((perm) =>
      hasPermissionAcrossSameNamedGroups(groups, CENTRAL, perm)
    ) ||
    hasPermissionAcrossSameNamedGroups(groups, CENTRAL, "");

  const canShowServicos =
    isRootOrAdmin ||
    Boolean(
      hasPermission &&
        (hasPermission(CONFIGURACAO, PERMISSION_SERVICOS) ||
          hasPermission(CONFIGURACAO, PERMISSION_SERVICOS_FALLBACK))
    ) ||
    hasPermissionAcrossSameNamedGroups(
      groups,
      CONFIGURACAO,
      PERMISSION_SERVICOS
    ) ||
    hasPermissionAcrossSameNamedGroups(
      groups,
      CONFIGURACAO,
      PERMISSION_SERVICOS_FALLBACK
    );

  return {
    canShowCentralTripCategory: canShowCentral,
    canShowServicosTripCategory: canShowServicos,
  };
}
