import { RFValue } from 'react-native-responsive-fontsize';
import {
  Feather,
  MaterialIcons,
  FontAwesome,
} from '@expo/vector-icons';
import { TextEdit } from '../TextEdit';
import {
  BackPage,
  Border,
  Container,
  ContainerButton,
  ButtonIcon,
  Content,
  ContentPrice,
  ContentTaximeter,
  ContentTime,
  Header,
  TextPrice,
  TextTitle,
  Button,
  TitleContainer,
} from './styles';
import theme from '../../../../client/styles/theme';
import Helper from '../../utils/Helper';
import { useAuth } from '../../../../context/auth';
import { If } from '../If';
import Collapse from '../../../../client/components/Collapse';
import Skeleton from '../../../../common/Skeleton';
import { translate } from '../../../../client/locales';

const ViewTaximeterComponent = ({
  expanded,
  priceTaximeter,
  handleOnLayout,
  onClose,
  km,
  countMinute,
  loading,
  isPause,
  handlePlay,
  handlePause,
  handleStop,
  dataPrices,
}: any) => {
  const { cityConfig } = useAuth();

  return (
    <Container>
      <ButtonIcon onPress={handleOnLayout}>
        <Feather
          name={expanded ? 'chevron-down' : 'chevron-up'}
          size={RFValue(24)}
          color={theme.colors.primaryText}
        />
      </ButtonIcon>

      <Header>
        <If condition={priceTaximeter === 0}>
          <TitleContainer>
            <BackPage onPress={onClose}>
              <MaterialIcons
                name="keyboard-arrow-left"
                size={RFValue(30)}
                color={theme.colors.secondary}
              />
            </BackPage>
            <TextEdit>{translate('taximeter.title')}</TextEdit>
          </TitleContainer>
        </If>
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
                km: {Number(km)?.toFixed(2)}km - Tempo:{' '}
                {countMinute}min
              </TextEdit>
            </ContentTime>
          </>
        ) : (
          <TextEdit size="large" color={theme.colors.background_global}>
            Livre
          </TextEdit>
        )}
      </ContentTaximeter>
      <Collapse open={expanded}>
        <Content>
          <Border>
            <TextTitle>Tarifas</TextTitle>
          </Border>
          <Skeleton
            loading={loading}
            height={theme.fontSizes.small}
            width={"100%"}
            mv={theme.spacing.small}
            circle={2}
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
              disabled={loading || isPause || priceTaximeter === 0}
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
