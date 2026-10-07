import React from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useNavigation} from '@react-navigation/native';
import {ContainerButton} from './styles';
import theme from '../../styles/theme';

interface Props {
  onPress?: () => void;
}

export const BackButton = () => {
  const navigate = useNavigation();
  const handleRouter = () => {
    navigate.navigate('TripRoutes', {screen: 'Trip'});
  };
  return (
    <>
      <ContainerButton activeOpacity={0.8} onPress={handleRouter}>
        <Ionicons name="arrow-back" size={30} color={theme.colors.primaryText} />
      </ContainerButton>
    </>
  );
};
