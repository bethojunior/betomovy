import { useCallback } from 'react';
import { Platform } from 'react-native';
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
      const customerId = user?.idCustomer || (user as any)?.customerId || user?.idUser;
      if (!customerId) {
        throw new Error('Usuário inválido. Faça login novamente.');
      }

      const rawFilename = uri.split('/').pop() || 'profile.jpg';
      const cleanFilename = rawFilename.includes('.') ? rawFilename : `${rawFilename}.jpg`;
      const match = /\.(\w+)$/.exec(cleanFilename);
      const ext = match ? match[1].toLowerCase() : 'jpg';
      const type = ext === 'png' ? 'image/png' : 'image/jpeg';

      const fileUri = Platform.OS === 'android' ? uri : uri.replace('file://', '');

      const formData = new FormData();
      formData.append('customerId', String(customerId));
      formData.append('photo', {
        uri: fileUri,
        type,
        name: cleanFilename,
      } as any);

      try {
        const response = await apiMain.post('Customer/UpdateProfileImage', formData, {
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
