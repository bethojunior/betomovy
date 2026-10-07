import {RFValue} from 'react-native-responsive-fontsize';
import {
  SimpleLineIcons,
  MaterialIcons,
  FontAwesome,
  Foundation,
} from '@expo/vector-icons';
import {TextEdit} from '../TextEdit';
import {
  BackPage,
  Border,
  Container,
  ContainerButton,
  ContainerIcon,
  Content,
  ContentPrice,
  ContentTaximeter,
  ContentTime,
  Header,
  Icon,
  TextPrice,
  TextTitle,
  Button,
  InfoButton,
  TitleContainer,
} from './styles';
import theme from '../../../../client/styles/theme';
import Helper from '../../utils/Helper';
import {useAuth} from '../../../../context/auth';
import {If} from '../If';
import Collapse from '../../../../client/components/Collapse';
import Skeleton from '../../../../common/Skeleton';
import {View, Text, Alert} from 'react-native';
import {SwalAlert} from '../../../../client/components/SwalAlert';
import {useState} from 'react';
import {translate} from '../../../../client/locales';

const ViewTaximeterComponent = ({
  heightContainer,
  priceTaximeter,
  handleOnLayout,
  tripTaximeter,
  onClose,
  kmRef,
  countMinute,
  loading,
  isPause,
  handlePlay,
  handlePause,
  handleStop,
  dataPrices,
  lastKm,
  setVisible,
}: any) => {
  const {cityConfig} = useAuth();

  return (
    <Container>
      <Header>
        <ContainerIcon
          style={{
            marginBottom: priceTaximeter === 0 ? 20 : 0,
          }}
          onPress={() => handleOnLayout()}
          activeOpacity={0.8}
        >
          <Icon>
            <SimpleLineIcons
              name={heightContainer ? 'arrow-down' : 'arrow-up'}
              size={RFValue(15)}
              color={theme.colors.primaryText}
            />
          </Icon>
        </ContainerIcon>
        <If condition={priceTaximeter === 0}>
          <TitleContainer>
            <BackPage
              onPress={() => {
                if (tripTaximeter && Object.keys(tripTaximeter).length > 0) {
                  return;
                }
                onClose();
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={RFValue(30)}
                color={theme.colors.secondary}
              />
            </BackPage>
            <TextEdit>{translate('taximeter.title')}</TextEdit>
          </TitleContainer>
        </If>
        <InfoButton onPress={() => setVisible(true)}>
          <Foundation name="info" size={RFValue(25)} color="black" />
        </InfoButton>
      </Header>
      <ContentTaximeter>
        {priceTaximeter ? (
          <>
            <ContentPrice>
              <TextPrice>
                {cityConfig?.typeMoney}
                {Helper.maskMoney(Number(priceTaximeter))}
              </TextPrice>
            </ContentPrice>
            <ContentTime>
              <TextEdit size="large" color={theme.colors.background_global}>
                km: {(kmRef?.current + lastKm)?.toFixed(2)}km - tempo:{' '}
                {countMinute.current}min
              </TextEdit>
            </ContentTime>
          </>
        ) : (
          <TextEdit size="large" color={theme.colors.background_global}>
            Livre
          </TextEdit>
        )}
      </ContentTaximeter>
      <Collapse open={heightContainer}>
        <Content>
          <Border>
            <TextTitle>Tarifas</TextTitle>
          </Border>
          <Skeleton
            loading={loading}
            height={15}
            mv={theme.spacing.small / 2}
            width={100}
            circle={5}
          >
            <Content>
              <TextEdit size="small" color={theme.colors.secondary}>
                Bandeirada: {cityConfig?.typeMoney}
                {Helper.maskMoney(parseFloat(dataPrices?.base_price))} - Km:{' '}
                {cityConfig?.typeMoney}
                {Helper.maskMoney(parseFloat(dataPrices?.km_price))} - Tempo:{' '}
                {cityConfig?.typeMoney}
                {Helper.maskMoney(parseFloat(dataPrices?.minute_price))}
              </TextEdit>
            </Content>
          </Skeleton>

          <ContainerButton>
            <Button
              disabled={loading || (priceTaximeter !== 0 && !isPause)}
              onPress={handlePlay}
            >
              <FontAwesome
                name="play"
                size={RFValue(24)}
                color={theme.colors.primaryText}
              />
            </Button>

            <Button
              onPress={handlePause}
              disabled={isPause || priceTaximeter === 0}
            >
              <FontAwesome
                name="pause"
                size={RFValue(24)}
                color={theme.colors.primaryText}
              />
            </Button>

            <Button
              disabled={loading || priceTaximeter === 0}
              onPress={handleStop}
            >
              <FontAwesome
                name="stop"
                size={RFValue(24)}
                color={theme.colors.primaryText}
              />
            </Button>
          </ContainerButton>
        </Content>
      </Collapse>
    </Container>
  );
};

export default ViewTaximeterComponent;
