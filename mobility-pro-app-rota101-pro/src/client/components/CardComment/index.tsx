import {Alert} from 'react-native';
import {useEffect, useState} from 'react';
import {AntDesign, Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import StarRatings from '../StarRatings';
import {
  BackgroundTip,
  CommentBox,
  CommentLabel,
  Container,
  ContainerButtons,
  DecisionActionsRow,
  DecisionIconButton,
  DecisionLabel,
  DecisionRow,
  Divider,
  DriverInfo,
  DriverRatingBadge,
  DriverRatingText,
  FavoriteButton,
  FavoriteButtonText,
  Header,
  ImageProfile,
  ImageProfileButton,
  NameUser,
  PhotoColumn,
  StarsCaption,
  TipButton,
  TipButtonText,
} from './styles';
import theme from '../../styles/theme';
import {translate} from '../../locales';
import {useTrip} from '../../contexts/Trip';
import {AnimatedSlideY} from '../AnimatedSlideY';
import {CardTip} from '../CardTip';
import {If} from '../If';
import {ImageExpanded} from '../ImageExpanded';
import {useFavorite} from '../../contexts/favorite';
import {useAuth} from '../../../context/auth';
import {useAppConfig} from '../../hooks/useAppConfig';

interface CardCommentProps {
  trip: any;
  onPressInput: () => void;
  setStates: any;
}

type DecisionValue = 'confirmed' | 'reproved' | null;

export const CardComment = ({trip, onPressInput, setStates}: CardCommentProps) => {
  const {dispatchTripCustomer, stateTripCustomer} = useTrip();
  const {addFavorites, favorites} = useFavorite();
  const {user} = useAuth();
  const {isTipEnabled} = useAppConfig();

  const {commentFinish} = stateTripCustomer;
  const [valueTip, setValueTip] = useState(0);
  const [isDriverFavorited, setIsDriverFavorited] = useState<boolean>(false);
  const [activeTip, setActiveTip] = useState(false);
  const [photoDecision, setPhotoDecision] = useState<DecisionValue>(null);
  const [serviceDecision, setServiceDecision] = useState<DecisionValue>(null);
  const [modalImage, setModalImage] = useState(false);

  const resetDefaultStars = () => {
    dispatchTripCustomer({type: 'update', field: 'defaultRating', arg: 5});
  };

  const checkDriverIsFavorited = () => {
    const isDriverExists = favorites?.filter(
      data => data.idDriver === trip?.driver?.idDriver,
    );
    setIsDriverFavorited(isDriverExists.length > 0);
  };

  const addFavorite = async () => {
    Alert.alert(
      translate('detailsTrip.add_favorite'),
      translate('detailsTrip.favorite'),
      [
        {text: translate('detailsTrip.text_button_no'), style: 'cancel'},
        {
          text: translate('detailsTrip.text_button_yes'),
          onPress: async () => {
            await addFavorites(user?.idCustomer, trip?.driver?.idDriver);
            setIsDriverFavorited(!isDriverFavorited);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const togglePhotoDecision = (value: DecisionValue) => {
    const nextValue = photoDecision === value ? null : value;
    setPhotoDecision(nextValue);
    dispatchTripCustomer({
      type: 'update',
      field: 'photoFinishDecision',
      arg: nextValue === 'reproved' ? true : null,
    });
  };

  useEffect(() => {
    resetDefaultStars();
    checkDriverIsFavorited();
  }, []);

  return (
    <>
      <Container>
        <Header>
          <PhotoColumn>
            <ImageProfileButton activeOpacity={0.8} onPress={() => setModalImage(true)}>
              <ImageProfile source={{uri: trip?.driver?.profilePicture}} />
            </ImageProfileButton>
            <DriverRatingBadge>
              <DriverRatingText>
                {parseFloat(trip?.driver?.rating).toFixed(1).replace('.', ',')}
              </DriverRatingText>
              <AntDesign name="star" size={RFValue(10)} color={theme.colors.border_green} />
            </DriverRatingBadge>
          </PhotoColumn>
          <DriverInfo>
            <NameUser>{trip?.driver?.name}</NameUser>
            <StarRatings />
            <StarsCaption>{translate('finishTrip.tap_stars_to_rate')}</StarsCaption>
          </DriverInfo>
        </Header>

        <Divider />

        <DecisionRow>
          <DecisionLabel>{translate('finishTrip.does_the_collaborators_photo_match')}</DecisionLabel>
          <DecisionActionsRow>
            <DecisionIconButton activeOpacity={0.7} onPress={() => togglePhotoDecision('confirmed')}>
              <Ionicons
                name={photoDecision === 'confirmed' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={RFValue(28)}
                color={theme.colors.border_green}
              />
            </DecisionIconButton>
            <DecisionIconButton activeOpacity={0.7} onPress={() => togglePhotoDecision('reproved')}>
              <Ionicons
                name={photoDecision === 'reproved' ? 'close-circle' : 'close-circle-outline'}
                size={RFValue(28)}
                color={theme.colors.red}
              />
            </DecisionIconButton>
          </DecisionActionsRow>
        </DecisionRow>

        <DecisionRow>
          <DecisionLabel>{translate('finishTrip.service')}</DecisionLabel>
          <DecisionActionsRow>
            <DecisionIconButton
              activeOpacity={0.7}
              onPress={() => setServiceDecision(current => (current === 'confirmed' ? null : 'confirmed'))}
            >
              <Ionicons
                name={serviceDecision === 'confirmed' ? 'checkmark-circle' : 'checkmark-circle-outline'}
                size={RFValue(28)}
                color={theme.colors.border_green}
              />
            </DecisionIconButton>
            <DecisionIconButton
              activeOpacity={0.7}
              onPress={() => setServiceDecision(current => (current === 'reproved' ? null : 'reproved'))}
            >
              <Ionicons
                name={serviceDecision === 'reproved' ? 'close-circle' : 'close-circle-outline'}
                size={RFValue(28)}
                color={theme.colors.red}
              />
            </DecisionIconButton>
          </DecisionActionsRow>
        </DecisionRow>

        <CommentLabel>{translate('finishTrip.praise_or_Criticize')}</CommentLabel>
        <CommentBox
          onFocus={() => onPressInput()}
          returnKeyType="done"
          returnKeyLabel="done"
          numberOfLines={2}
          placeholder={translate('schedule.text_commentary')}
          onChangeText={text => setStates({comment: text})}
          defaultValue={commentFinish}
        />

        <ContainerButtons>
          <FavoriteButton activeOpacity={0.7} onPress={addFavorite} disabled={isDriverFavorited}>
            <Ionicons
              name={isDriverFavorited ? 'heart' : 'heart-outline'}
              size={RFValue(16)}
              color={theme.colors.red}
            />
            <FavoriteButtonText>
              {isDriverFavorited
                ? translate('favorites.text_button_isfavorited')
                : translate('favorites.text_button_favorite')}
            </FavoriteButtonText>
          </FavoriteButton>

          <If condition={isTipEnabled}>
            <TipButton activeOpacity={0.7} onPress={() => setActiveTip(!activeTip)}>
              <TipButtonText>{translate('tipClient.tip_worth')}</TipButtonText>
            </TipButton>
          </If>
        </ContainerButtons>
      </Container>

      <If condition={isTipEnabled}>
        <BackgroundTip>
          <AnimatedSlideY containerStyle={{}} showAddress={activeTip}>
            <CardTip
              setValueTip={setValueTip}
              valueTip={valueTip}
              image={trip?.driver?.profilePicture}
            />
          </AnimatedSlideY>
        </BackgroundTip>
      </If>

      <ImageExpanded
        modalImage={modalImage}
        setModalImage={setModalImage}
        source={trip?.driver?.profilePicture}
      />
    </>
  );
};
