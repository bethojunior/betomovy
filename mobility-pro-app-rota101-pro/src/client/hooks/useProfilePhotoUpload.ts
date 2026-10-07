import { useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

import apiMain from '../api/apiMain';
import { buildApp } from '../../constantBuild/config';
import { useAuth } from '../../context/auth';

interface UploadProfileImageOptions {
  timeout?: number;
  onSuccess?: (serverUrl: string, updatedUser: any) => void;
}

interface UploadProfileImageResult {
  serverUrl: string;
  updatedUser: any;
}

export function useProfilePhotoUpload() {
  const { user, setUser } = useAuth();

  const uploadProfileImage = useCallback(
    async (uri: string, options?: UploadProfileImageOptions): Promise<UploadProfileImageResult> => {
      if (!user?.idCustomer) {
        throw new Error('Usuário inválido. Faça login novamente.');
      }

      const filename = uri.split('/').pop() || 'photo.jpg';
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : 'image/jpeg';

      const formData = new FormData();
      formData.append('customerId', String(user.idCustomer));
      formData.append('photo', {
        uri,
        type,
        name: filename,
      } as any);

      try {
        const response = await apiMain.post('Customer/UpdateProfileImage', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          timeout: options?.timeout ?? 120000,
        });

        const { data } = response;
        if (!data?.status) {
          throw new Error(data?.message || 'Upload falhou');
        }

        const timestamp = Date.now();
        const serverUrl = data.data.startsWith('http')
          ? `${data.data}?v=${timestamp}`
          : `${buildApp().HOST_IMAGE_CUSTOMER}${data.data}?v=${timestamp}`;

        const updatedUser = {
          ...user,
          profileImageLink: serverUrl,
          profileImage: serverUrl,
        };

        await AsyncStorage.setItem('@Auth:user', JSON.stringify(updatedUser));
        setUser(updatedUser);

        options?.onSuccess?.(serverUrl, updatedUser);

        return { serverUrl, updatedUser };
      } catch (error) {
        throw error;
      }
    },
    [setUser, user],
  );

  return {
    uploadProfileImage,
  };
}
