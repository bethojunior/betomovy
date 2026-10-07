import { useState } from 'react';
import api from '../services/api';

export function useDocUserActions() {
  const [loading, setLoading] = useState(false);

  const changeStatus = async (docId: number, docStatusId: string | number) => {
    setLoading(true);
    try {
      const { data } = await api.put(`docUser/${docId}`, { docStatusId });
      if (!data.status) throw new Error('update-status-failed');
      return data.response;
    } finally {
      setLoading(false);
    }
  };

  const requestNew = async (
    userId: number,
    docId: string | number,
    docStatusId: string | number,
  ) => {
    setLoading(true);
    try {
      const response = await api.post('docUser', {
        docId: String(docId),
        docStatusId: String(docStatusId),
        userId,
      });
      if (response.request.status === 400) throw new Error('doc-already-in-use');
      return response.data.response;
    } finally {
      setLoading(false);
    }
  };

  return { loading, changeStatus, requestNew };
}
