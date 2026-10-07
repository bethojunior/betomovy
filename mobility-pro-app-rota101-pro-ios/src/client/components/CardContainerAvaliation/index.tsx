import {View} from 'react-native';
import theme from '../../styles/theme';
import {
  ContainerAvaliationsContent,
  ContainerAvaliationsContentItem,
  ContentColumn,
  DriverRating,
  HeaderComment,
  Subtitle,
  ViewTitle,
} from './styles';
import {Feather, AntDesign} from '@expo/vector-icons';
import {TextEdit} from '../TextEdit';
import Helper from '../../utils/Helper';

interface Props {
  trip: any;
}

export const CardAvaliation = ({trip}: Props) => {
  return (
    <ContainerAvaliationsContent>
      <ContainerAvaliationsContentItem>
        <View
          style={{
            width: 50,
            height: 50,
            backgroundColor: theme.colors.primary,
            borderRadius: 50,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Feather name="thumbs-up" size={24} color={theme.colors.primaryText} />
        </View>
        <ContentColumn>
          <HeaderComment>
            <ViewTitle>
              <TextEdit size="medium" color={theme.colors.secondary}>
                Jeova Junior
              </TextEdit>

              <DriverRating>
                <AntDesign name="star" size={12} color="orange" />
                {/* @ts-ignore */}
                {Helper.starFloat(trip?.driver?.rating)}
              </DriverRating>
            </ViewTitle>
            <Subtitle>10/10/2020</Subtitle>
          </HeaderComment>
          <TextEdit size="small" color={theme.colors.secondary}>
            Comentario asdfhaskdfjhaskjhjkhasjkfhdakjshdf ajiskdhf
            auisdfhaisudfhasiudfhasiufdhasuihdfiuashaas
          </TextEdit>
        </ContentColumn>
      </ContainerAvaliationsContentItem>
    </ContainerAvaliationsContent>
  );
};
