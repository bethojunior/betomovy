// @ts-nocheck
import React from 'react';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  ServiceTypeItem,
  ServiceTypeItemContent,
  ServiceTypeItemImage,
  ServiceTypeItemText,
} from '../../pages/Home/styles';

import {Container} from './styles';

export function CardItemNavHome({text, icon, onPress}) {
  return (
    <ServiceTypeItem>
      <TouchableOpacity onPress={onPress}>
        <ServiceTypeItemContent>
          <ServiceTypeItemImage source={icon} resizeMode="contain" />
          <ServiceTypeItemText>{text}</ServiceTypeItemText>
        </ServiceTypeItemContent>
      </TouchableOpacity>
    </ServiceTypeItem>
  );
}
