import AsyncStorage from '@react-native-async-storage/async-storage';

type AuthIdentityType = 'user' | 'driver';

export interface AuthIdentity {
  id: string;
  type: AuthIdentityType;
}

export const getAuthIdentity = async (): Promise<AuthIdentity | null> => {
  try {
    const [userJson, userDriverJson] = await Promise.all([
      AsyncStorage.getItem('@Auth:user'),
      AsyncStorage.getItem('@Auth:userDriver'),
    ]);

    const user = userJson ? JSON.parse(userJson) : null;
    const userDriver = userDriverJson ? JSON.parse(userDriverJson) : null;

    if (userDriver?.idDriver) return {id: String(userDriver.idDriver), type: 'driver'};
    if (user?.idUser) return {id: String(user.idUser), type: 'user'};

    return null;
  } catch (error) {
    console.error('Erro ao obter AuthIdentity:', error);
  }
};
