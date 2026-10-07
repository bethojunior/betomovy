import { useState } from 'react';
import api from '../services/api';

export function useDocUserImageUpload() {
  const [uploading, setUploading] = useState(false);

  const uploadDocImage = async (docId: number, file: File) => {
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await api.post(`docUser/${docId}/image`, formData);

      return data.response;
    } finally {
      setUploading(false);
    }
  };

  return { uploading, uploadDocImage };
}
