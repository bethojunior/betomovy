import {Alert, View} from 'react-native';
import StarRatings from '../StarRatings';
import {
  BackgroundTip,
  ButtonAction,
  CommentBox,
  Container,
  ContainerButtons,
  ContainerImage,
  DriverRating,
  DriverRatingContainer,
  Header,
  ImageProfile,
  NameUser,
  TextButton,
} from './styles';

import {AntDesign} from '@expo/vector-icons';
import {DecisionsActions} from '../DecisionActions';
import {lighten} from 'polished';
import theme from '../../styles/theme';
import {translate} from '../../locales';
import {useEffect, useState} from 'react';
import {useTrip} from '../../contexts/Trip';
import {AnimatedSlideY} from '../AnimatedSlideY';
import {CardTip} from '../CardTip';
import {If} from '../If';
import {useFavorite} from '../../contexts/favorite';
import {useAuth} from '../../../context/auth';

interface CardCommentProps {
  trip: any;
  onPressInput: () => void;
  setStates: any;
}

let heightMax = 0;

export const CardComment = ({
  trip,
  onPressInput,
  setStates,
}: CardCommentProps) => {
  const {dispatchTripCustomer, stateTripCustomer} = useTrip();
  const {addFavorites, favorites} = useFavorite();
  const {user} = useAuth();
  const star = '5';

  const {commentFinish} = stateTripCustomer;
  const [valueTip, setValueTip] = useState(0);
  const [isDriverFavorited, setIsDriverFavorited] = useState<boolean>(false);
  const [activeTip, setActiveTip] = useState(false);

  const checkDriverIsFavorited = () => {
    const isDriverExists = favorites?.filter(
      data => data.idDriver === trip?.driver?.idDriver,
    );
    if (isDriverExists.length > 0) {
      setIsDriverFavorited(true);
    } else {
      setIsDriverFavorited(false);
    }
  };

  const addFavorite = async () => {
    Alert.alert(
      translate('detailsTrip.add_favorite'),
      translate('detailsTrip.favorite'),
      [
        {
          text: translate('detailsTrip.text_button_no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
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

  const handleReprovedPhoto = (e?: string) => {
    if (e === 'reproved') {
      dispatchTripCustomer({
        type: 'update',
        field: 'photoFinishDecision',
        arg: true,
      });
      return;
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'photoFinishDecision',
      arg: null,
    });
  };

  useEffect(() => {
    checkDriverIsFavorited();
  }, []);

  return (
    <>
      <Container
        onLayout={event => {
          const {height} = event.nativeEvent.layout;
          heightMax = height;
        }}
      >
        <Header>
          <ContainerImage>
            <ImageProfile
              source={{
                uri: trip?.driver?.profilePicture,
              }}
            />
          </ContainerImage>
          <View>
            <NameUser>{trip?.driver?.name}</NameUser>
            <StarRatings />
          </View>
          <DriverRatingContainer>
            <DriverRating>
              {parseFloat(trip?.driver?.rating).toFixed(1).replace('.', ',')}
            </DriverRating>
            <AntDesign name="star" size={10} color="orange" />
          </DriverRatingContainer>
        </Header>
        <DecisionsActions
          text={translate('finishTrip.does_the_collaborators_photo_match')}
          onPressAction={handleReprovedPhoto}
        />
        <DecisionsActions text={translate('finishTrip.service')} />
        <DecisionsActions
          text={translate('finishTrip.praise_or_Criticize')}
          noActions
        />
        <CommentBox
          multiline
          onFocus={() => onPressInput()}
          placeholderTextColor={lighten(0.2, theme.colors.secondary)}
          returnKeyType="done"
          returnKeyLabel="done"
          numberOfLines={2}
          placeholder={translate('schedule.text_commentary')}
          onChangeText={text => setStates({comment: text})}
          defaultValue={commentFinish}
        />
        <ContainerButtons>
          <ButtonAction
            bg="#E8A803"
            onPress={async () => {
              await addFavorite();
            }}
            disabled={isDriverFavorited}
          >
            <TextButton>
              {isDriverFavorited
                ? translate('favorites.text_button_isfavorited')
                : translate('favorites.text_button_favorite')}
            </TextButton>
          </ButtonAction>

          <ButtonAction
            bg="#0395E8"
            onPress={() => {
              setActiveTip(!activeTip);
            }}
          >
            <TextButton>{translate('tipClient.tip_worth')}</TextButton>
          </ButtonAction>
        </ContainerButtons>
      </Container>

      <BackgroundTip>
        <AnimatedSlideY
          containerStyle={{
            backgroundColor: theme.colors.white_light,
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            borderTopLeftRadius: 5,
            borderTopRightRadius: 5,
          }}
          showAddress={activeTip}
        >
          <CardTip
            setValueTip={setValueTip}
            valueTip={valueTip}
            image={trip?.driver?.profilePicture}
          />
        </AnimatedSlideY>
      </BackgroundTip>
    </>
  );
};
