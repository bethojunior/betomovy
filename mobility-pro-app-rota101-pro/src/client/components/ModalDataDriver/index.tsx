import { Dimensions, Modal, Animated, PanResponder } from 'react-native';
import { Ionicons, AntDesign, Feather, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useEffect, useRef, useState } from 'react';
import { shade } from 'polished';
import {
  BackButton,
  Container,
  ContainerAvaliations,
  ContainerDriver,
  ContainerMore,
  ContainerTravel,
  Content,
  ContentCenter,
  ContentModal,
  ContentRow,
  DriverInfoContainer,
  DriverProfilePicture,
  DriverRating,
  DriverRatingContainer,
  HeaderBack,
  Nickname,
  NicknameContainer,
} from './styles';
import theme from '../../styles/theme';
import { TextEdit } from '../TextEdit';
import { useTrip } from '../../contexts/Trip';
import { useFavorite } from '../../contexts/favorite';
import { CardAvaliation } from '../CardContainerAvaliation';

interface Props {
  visible: boolean;
  setVisible?: any;
}

const windowHeight = Dimensions.get('window').height;
const MAX_BOTTOM_SHEET_HEIGHT = windowHeight - 200;
const MIN_BOTTOM_SHEET_HEIGHT = 350;

const MAX_Y = MIN_BOTTOM_SHEET_HEIGHT - MAX_BOTTOM_SHEET_HEIGHT;
const MIN_Y = 0;

export const ModalDataDriver = ({ visible, setVisible }: Props) => {
  const { stateTripCustomer } = useTrip();

  const { trip } = stateTripCustomer;
  const { findPerCodeDriver } = useFavorite();

  const [detailsDriver, setDetailsDriver] = useState({});

  const findDriver = async () => {
    // @ts-ignore
    if (!trip.driver) {
      return;
    }
    // @ts-ignore
    const response = await findPerCodeDriver(trip?.driver?.idDriver);
    setDetailsDriver(response);
  };
  useEffect(() => {
    findDriver();
  }, []);

  const [isDragging, setIsDragging] = useState(false);
  const sheetRef = useRef(new Animated.Value(0)).current;
  const lastRef = useRef(0);
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        sheetRef.setOffset(lastRef.current);
      },
      onPanResponderMove: (event, gestureState) => {
        sheetRef.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        sheetRef.flattenOffset();
      },
    }),
  ).current;

  const animatedStyles = {
    height: sheetRef.interpolate({
      inputRange: [MAX_Y, MIN_Y],
      outputRange: [MAX_BOTTOM_SHEET_HEIGHT, MIN_BOTTOM_SHEET_HEIGHT],
      extrapolate: 'clamp',
    }),
  };

  const starFloat = (value: string) => {
    return parseFloat(value).toPrecision(2);
  };

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <ContentModal>
          <Container style={animatedStyles}>
            <ContainerDriver {...panResponder.panHandlers}>
              <HeaderBack {...panResponder.panHandlers}>
                <BackButton
                  activeOpacity={0.7}
                  onPress={() => setVisible(false)}
                >
                  <Ionicons
                    name="arrow-back"
                    size={RFValue(30)}
                    color={theme.colors.secondary}
                  />
                </BackButton>
              </HeaderBack>
              <DriverInfoContainer>
                <DriverProfilePicture
                  // @ts-ignore
                  source={{ uri: trip?.driver?.profilePicture }}
                />
              </DriverInfoContainer>

              <NicknameContainer>
                <Feather
                  name="user-check"
                  size={22}
                  color={theme.colors.secondary}
                />
                <Nickname>
                  {/* @ts-ignore */}
                  {trip?.driver?.nickname || 'Juninho dos Transportes'}
                </Nickname>
              </NicknameContainer>
              <DriverRatingContainer>
                <DriverRating>
                  <AntDesign name="star" size={12} color="orange" />
                  {/* @ts-ignore */}
                  {starFloat(trip?.driver?.rating)} - {trip?.driver?.rating * 5}{' '}
                  avaliações
                </DriverRating>
              </DriverRatingContainer>

              <ContainerTravel>
                <ContentRow>
                  <Ionicons
                    name="car"
                    size={RFValue(20)}
                    color={theme.colors.secondary}
                  />
                  <Content>
                    <TextEdit size="small" color={theme.colors.secondary}>
                      Corridas
                    </TextEdit>
                    <TextEdit size="small" color={theme.colors.secondary}>
                      410
                    </TextEdit>
                  </Content>
                </ContentRow>

                <ContentRow>
                  <MaterialIcons
                    name="verified-user"
                    size={RFValue(20)}
                    color={theme.colors.secondary}
                  />
                  <Content>
                    <TextEdit
                      size="small"
                      change="none"
                      color={theme.colors.secondary}
                    >
                      Experiência
                    </TextEdit>
                    <TextEdit size="small" color={theme.colors.secondary}>
                      5 anos
                    </TextEdit>
                  </Content>
                </ContentRow>
              </ContainerTravel>

              <ContainerMore>
                <TextEdit
                  size="small"
                  color={shade(0.04, theme.colors.secondary)}
                  change="none"
                >
                  Mais informações
                </TextEdit>
                <MaterialIcons
                  name="keyboard-arrow-up"
                  size={24}
                  color={theme.colors.secondary}
                />
              </ContainerMore>
            </ContainerDriver>
            <ContainerAvaliations>
              <ContentCenter>
                <TextEdit size="medium" color={theme.colors.secondary}>
                  Avaliações
                </TextEdit>
              </ContentCenter>
              <CardAvaliation trip={trip} />
              <CardAvaliation trip={trip} />

              <CardAvaliation trip={trip} />
            </ContainerAvaliations>
          </Container>
        </ContentModal>
      </Modal>
    </>
  );
};
