import { useLocationUpdater } from '../../hooks/useLocationUpdater';
import { useAuth } from '../../../context/auth';

export const LocationUpdater = () => {
  const { user } = useAuth();
  useLocationUpdater({ userId: user?.idUser });
  return null;
};