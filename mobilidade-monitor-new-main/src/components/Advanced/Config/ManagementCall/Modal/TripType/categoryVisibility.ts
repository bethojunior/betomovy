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
      item.name === groupName && item.permissions.includes(permissionName)
  );
}

export function getTripTypeCategoryVisibility(
  groups: Group[] | undefined
): TripTypeCategoryVisibility {
  return {
    canShowCentralTripCategory: CENTRAL_SUBMENU_PERMISSIONS.some((perm) =>
      hasPermissionAcrossSameNamedGroups(groups, CENTRAL, perm)
    ),
    canShowServicosTripCategory:
      hasPermissionAcrossSameNamedGroups(
        groups,
        CONFIGURACAO,
        PERMISSION_SERVICOS
      ) ||
      hasPermissionAcrossSameNamedGroups(
        groups,
        CONFIGURACAO,
        PERMISSION_SERVICOS_FALLBACK
      ),
  };
}
