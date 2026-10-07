import React from 'react';
import styled from 'styled-components/native';
import {Modal, TouchableOpacity, ScrollView, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  CloseButton,
  CompanyName,
  ItemText,
  ModalContent,
  ModalOverlay,
  OrderCode,
  ProfileImage,
  Section,
  SectionTitle,
} from './styles';
import theme from '../../../styles/theme';
import {OrderProps} from '../../../../../context/DeliveryOrder/types';
import {useAuth} from '../../../../../context/auth';
import {translate} from '../../../../../client/locales';

interface Props {
  selectedDelivery: OrderProps;
  onRequestClose: () => void;
}

export const DeliveryModal = ({selectedDelivery, onRequestClose}: Props) => {
  const {cityConfig} = useAuth();
  if (!selectedDelivery) return null;

  return (
    <Modal
      visible={!!selectedDelivery}
      transparent
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <ModalOverlay>
        <ModalContent>
          <CloseButton onPress={onRequestClose}>
            <Ionicons name="close" size={24} color={theme.colors.primaryText} />
          </CloseButton>

          <ProfileImage
            source={{
              uri: selectedDelivery?.company?.company_delivery_config?.picture,
            }}
          />

          <CompanyName>{selectedDelivery?.company?.fantasyName}</CompanyName>

          <OrderCode>Pedido #{selectedDelivery?.id}</OrderCode>

          <Section>
            <SectionTitle>Pagamento</SectionTitle>
            <Text>{selectedDelivery?.delivery_payment_form?.name}</Text>
          </Section>
          <Section>
            <SectionTitle>Valor</SectionTitle>
            <Text>
              {cityConfig?.typeMoney || 'R$'}
              {` ${selectedDelivery?.value}`}
            </Text>
          </Section>

          <Section>
            <SectionTitle>
              {translate('guestRoutes.title_delivery_address')}
            </SectionTitle>
            <Text>
              {selectedDelivery?.delivery_order_place?.place?.address}
            </Text>
          </Section>

          <Section>
            <SectionTitle>Itens do Pedido</SectionTitle>
            {selectedDelivery?.delivery_order_items?.map((item, index) => (
              <ItemText key={index}>
                {item?.quantity} - {item?.delivery_product?.name}
              </ItemText>
            ))}
          </Section>
        </ModalContent>
      </ModalOverlay>
    </Modal>
  );
};
