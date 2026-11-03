import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Preload from '../../../components/Preload';

interface SplashProps {
  route?: any;
  type: 'client' | 'driver';
}

const Splash = ({ type }: SplashProps) => {
  const navigate = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate.navigate(type === 'client' ? 'SignIn' : 'Home');
    }, 1800);
    return () => clearTimeout(timer);
  }, [navigate, type]);

  return <Preload visible={true} type="brand" transparent={false} />;
};

export default Splash;
