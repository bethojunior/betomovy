import { useAuth } from '../../context/auth';

export const useAppConfig = () => {
  const { generalSettings } = useAuth();

  const isConfigEnabled = (key: string): boolean => {
    const config = generalSettings?.find(setting => setting.key === key);
    return config?.value === '1';
  };

  return {
    isTipEnabled: isConfigEnabled('enable_tip_race'),
  };
};