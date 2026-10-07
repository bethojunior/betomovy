import { useMemo } from 'react';
import { useUserDriver } from '../context/userDriver';
import { DocumentsRepository } from '../../../common/services/documents/types';
import { createDriverDocumentsRepository } from '../services/documents/DriverDocumentsRepository';

export function useDocumentsRepository(): DocumentsRepository {
  const { userDriverFind } = useUserDriver();

  return useMemo(
    () => createDriverDocumentsRepository({
      getDriverId: () => userDriverFind?.idDriver,
      getUserTypeId: () => userDriverFind?.userTypeId,
    }),
    [userDriverFind?.idDriver, userDriverFind?.userTypeId],
  );
}
