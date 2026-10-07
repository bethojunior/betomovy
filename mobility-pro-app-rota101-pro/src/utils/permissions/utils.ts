import { PermissionType } from './types';
import { REQUIRED_PERMISSIONS } from './constants';

/** Retorna as permissões obrigatórias que estão faltando. */
export const getMissingRequiredPermissions = (
  disabledPermissions: PermissionType[],
): PermissionType[] => {
  return disabledPermissions.filter((permission) =>
    (REQUIRED_PERMISSIONS as readonly PermissionType[]).includes(permission),
  );
};

/** Verifica se as permissões obrigatórias estão concedidas */
export const hasRequiredPermissions = (
  disabledPermissions: PermissionType[],
): boolean => {
  return getMissingRequiredPermissions(disabledPermissions).length === 0;
};
