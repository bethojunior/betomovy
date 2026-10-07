import React, {FC, useEffect, useState} from 'react';
import StarIcon from '@expo/vector-icons/EvilIcons';
import {useLocal} from '../../contexts/local';
import {
  ContentPlaces,
  CardPlace,
  ContentTitle,
  SubTitle,
  Title,
} from './styles';
import theme from '../../styles/theme';
import {TextEdit} from '../TextEdit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Helper from '../../utils/Helper';
import {translate} from '../../locales';

interface Props {
  handleAddressSelected: (item: PlacesItem, type: string) => void;
  visible: boolean;
  setVisible: (status: boolean) => void;
  type: string;
}

interface PlacesItem {
  referencePoint: string;
  address: string;
}

export const SavedLocalPlaces: FC<Props> = ({
  handleAddressSelected,
  visible,
  setVisible,
  type,
}) => {
  const [places, setPlaces] = useState([]);

  const lastPlaces = async () => {
    const request = await AsyncStorage.getItem('lastPlaces');
    if (request) {
      // setPlaces(JSON.parse(lastPlaces).reverse());
      const parse = await JSON.parse(request);
      const response = await Helper.indicatorsWithFilterId(
        parse.reverse(),
        setPlaces,
      );
      setPlaces(response);
      return response;
    }
    return [];
  };
  useEffect(() => {
    lastPlaces();
  }, []);
  return (
    <>
      <ContentPlaces visible={visible}>
        <TextEdit color={theme.colors.border_green}>
          {translate('trip.last_destinys')}
        </TextEdit>
        {places.map((item: PlacesItem, index) => {
          return (
            <CardPlace
              key={index}
              onPress={() => {
                handleAddressSelected(item, type);
                setVisible(false);
              }}
            >
              <StarIcon
                name="star"
                size={22}
                style={{
                  marginRight: 5,
                  color: theme.colors.border_green,
                }}
              />
              <SubTitle>{item.address}</SubTitle>
            </CardPlace>
          );
        })}
      </ContentPlaces>
    </>
  );
};
