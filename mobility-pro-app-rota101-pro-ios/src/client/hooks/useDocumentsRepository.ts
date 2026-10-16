import { useMemo } from 'react';
import { useAuth } from '../../context/auth';
import { DocumentsRepository } from '../../common/services/documents/types';
import { createClientDocumentsRepository } from '../services/documents/ClientDocumentsRepository';

export function useDocumentsRepository(): DocumentsRepository {
  const { user } = useAuth();

  return useMemo(
    () => createClientDocumentsRepository({ getUserId: () => user?.idUser }),
    [user?.idUser],
  );
}
