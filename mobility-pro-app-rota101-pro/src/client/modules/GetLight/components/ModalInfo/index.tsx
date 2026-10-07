// @ts-nocheck

import React from 'react';
import { FlatList, Text } from 'react-native';
import {
  Container,
  ContainerColumnText,
  ContainerContent,
  ContainerIcon,
  ImageCar,
  TextTitle,
} from './style';
import ModalFrame from '../../../../components/form/Modal';
import { SvgUri } from 'react-native-svg';
import { RFValue } from 'react-native-responsive-fontsize';
import { If } from '../If';
import { Feather } from '@expo/vector-icons';
import theme from '../../../../styles/theme';

export function ModalInfo({ setVisible, visible, prices }) {

  const transformTag = (tag: string) => {
    return tag.includes('div');
  }

  return (
    <>
      <ModalFrame
        visible={visible}
        setVisible={setVisible}
        hideCancel
        textConfirm="Ok"
        onPressConfirm={() => setVisible(false)}
        onClose={() => setVisible(false)}
      >
        <Container>
          <FlatList
            data={prices}
            renderItem={({ item }) => (
              <ContainerContent>
                {item?.picture?.split('.').pop() === 'svg' ? (
                  <SvgUri
                    width={RFValue(50)}
                    height={RFValue(50)}
                    uri={item?.picture}
                  />
                ) : (
                  <ImageCar source={{ uri: item.picture }} />
                )}

                <ContainerColumnText>
                  <ContainerIcon>
                    <If condition={transformTag(item?.tag)}>
                      <Feather
                        style={{ marginRight: 5 }}
                        name="trending-up"
                        size={RFValue(12)}
                        color={theme.colors.primary}
                      />
                    </If>
                    <TextTitle>{`${transformTag(item?.tag)
                        ? item?.multiplierPriceDynamic
                        : item?.tag
                      }`}</TextTitle>
                  </ContainerIcon>

                  <Text>{item?.description}</Text>
                </ContainerColumnText>
              </ContainerContent>
            )}
            keyExtractor={item => `${item?.idPrice}`}
          />
        </Container>
      </ModalFrame>
    </>
  );
}
