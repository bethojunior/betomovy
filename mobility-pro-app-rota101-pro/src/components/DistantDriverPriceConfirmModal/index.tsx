import { FC, useState, useEffect, useRef } from 'react';
import { Modal } from 'react-native';
import Octicons from '@expo/vector-icons/Octicons';
import Ionicons from '@expo/vector-icons/Ionicons';

import {
  ModalContent,
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardBody,
  Description,
  CardFooter,
  ButtonOutlined,
  NewPriceContainer,
  NewPriceTitle,
  NewPriceValue,
  CheckItemsContainer,
  CheckItem,
  CheckItemLabel,
  ButtonText,
  ButtonOutlinedText,
} from './styles';

import { useTheme } from 'styled-components/native';
import { useAuth } from '~/context/auth';
import Helper from '~/client/utils/Helper';
import { useTranslation } from '~/hooks/useTranslation';

interface Props {
  visible: boolean;
  onPressContinue?: () => void;
  onPressSearchNew?: () => void;
  isLoading?: boolean;
  newPrice?: number;
}

const DistantDriverPriceConfirmationModal: FC<Props> = ({
  visible,
  onPressContinue,
  onPressSearchNew,
  newPrice = 0,
  isLoading,
}) => {
  const [countdown, setCountdown] = useState<number>(30);
  const intervalId = useRef<NodeJS.Timeout | null>(null);

  const theme = useTheme();
  const { cityConfig } = useAuth();
  const { t } = useTranslation();

  const typeMoney = cityConfig?.typeMoney || 'R$';

  const handleClearInterval = () => {
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
  }

  const handleConfirm = () => {
    handleClearInterval();
    if (onPressContinue) onPressContinue();
  }

  const handleClose = () => {
    clearInterval(intervalId.current);
    if (onPressSearchNew) onPressSearchNew();
  }

  const onSubmit = (prev: number) => {
    if (prev <= 1) {
      handleConfirm();
      return 0;
    }
    return prev - 1;
  }

  useEffect(() => {
    if (countdown <= 0 || !visible) return;

    intervalId.current = setInterval(() => {
      setCountdown(prev => onSubmit(prev));
    }, 1000);

    return () => handleClearInterval();
  }, [visible]);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={handleClose}
    >
      <ModalContent pointerEvents={isLoading ? 'none' : 'auto'}>
        <Card>
          <CardHeader>
            <Octicons name="alert-fill" size={24} color={theme.colors.yellowStrong} />
            <CardTitle>{t('trip.longDistanceModal.title')}</CardTitle>
          </CardHeader>

          <CardBody>
            <Description>{t('trip.longDistanceModal.description')}</Description>

            <NewPriceContainer>
              <NewPriceTitle>{t('trip.longDistanceModal.newPriceTitle')}</NewPriceTitle>
              <NewPriceValue>{typeMoney} {Helper.maskMoney(newPrice)}</NewPriceValue>
            </NewPriceContainer>

            <CheckItemsContainer>
              <CheckItem>
                <Octicons name="check-circle-fill" size={14} color={theme.colors.serene_green} />
                <CheckItemLabel>{t('trip.longDistanceModal.driverNotified')}</CheckItemLabel>
              </CheckItem>
              <CheckItem>
                <Octicons name="check-circle-fill" size={14} color={theme.colors.serene_green} />
                <CheckItemLabel>{t('trip.longDistanceModal.tripConfirmed')}</CheckItemLabel>
              </CheckItem>
            </CheckItemsContainer>

            <Description>{t('trip.longDistanceModal.descriptionConfirm')}</Description>
          </CardBody>

          <CardFooter>
            <ButtonOutlined onPress={handleClose} disabled={isLoading}>
              <Ionicons name="search-outline" size={24} color={theme.colors.black} />
              <ButtonOutlinedText>{t('trip.longDistanceModal.searchCloser')}</ButtonOutlinedText>
            </ButtonOutlined>

            <Button onPress={handleConfirm} disabled={isLoading}>
              <Ionicons name="car" size={24} color={theme.colors.primaryText} />
              <ButtonText>
                {t('trip.longDistanceModal.continueFor')}{"\n"}
                {typeMoney} {Helper.maskMoney(newPrice)}
                <ButtonText font="secondary_regular">{" "}({countdown}s)</ButtonText>
              </ButtonText>
            </Button>
          </CardFooter>
        </Card>
      </ModalContent>
    </Modal>
  );
};

export default DistantDriverPriceConfirmationModal;
