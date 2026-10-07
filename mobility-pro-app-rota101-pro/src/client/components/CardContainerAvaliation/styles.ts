import {shade} from 'polished';
import {StyleSheet, Animated} from 'react-native';
import {Button} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface PropsModal {
  height?: number;
}

export const ContentModal = styled.View`
  flex: 1;
  justify-content: flex-end;
  width: 100%;
`;

export const ContainerModal = styled.View<PropsModal>`
  background-color: ${({theme}) => theme.colors.background_global};
  height: ${({height}) => height || 200}px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: ${({theme}) => theme.spacing.xlarge}px;
`;

export const HeaderBack = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
`;

export const Draggable = styled.TouchableOpacity`
  width: 80px;
  height: 5px;
  border-radius: 5px;
  margin: 0 auto;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const BackButton = styled.TouchableOpacity`
  position: absolute;
`;

export const Container = styled(Animated.View)`
  background-color: ${({theme}) => theme.colors.background_global};
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  padding: ${({theme}) => theme.spacing.xlarge}px;

  align-items: center;
`;

export const ContainerDriver = styled.View`
  width: 100%;
  flex-direction: column;
  margin: ${({theme}) => theme.spacing.xlarge}px 0;
  align-items: center;
`;

export const DriverInfoContainer = styled.View`
  align-items: center;
`;

export const DriverProfilePicture = styled.Image`
  width: ${RFValue(80)}px;
  height: ${RFValue(80)}px;
  border-radius: 80px;
`;

export const DriverRatingContainer = styled.View`
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  width: 100%;

  border-radius: 10px;
`;

export const DriverRating = styled.Text`
  margin-left: 5px;
  width: 100%;
  text-align: center;
`;

export const NicknameContainer = styled.View`
  flex-direction: row;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  align-items: center;
`;

export const Nickname = styled.Text`
  margin-left: 10px;
  font-size: 20px;
  font-family: ${({theme}) => theme.fonts.medium};
`;

export const ContainerAddress = styled.View`
  border-top-color: ${({theme}) => shade(0.08, theme.colors.background_global)};
  border-top-width: 1px;
  border-bottom-color: ${({theme}) =>
    shade(0.08, theme.colors.background_global)};
  border-bottom-width: 1px;
`;

export const SeparateIcon = styled.View`
  width: 2px;
  height: 10px;
  align-items: center;
  justify-content: center;
  background-color: red;
  margin: ${({theme}) => theme.spacing.medium}px 0;
`;

export const ContainerButton = styled.View`
  width: 100%;
  margin: ${({theme}) => theme.spacing.xlarge}px 0;
`;

export const ButtonPaper = styled(Button)`
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ContainerTravel = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  margin: ${({theme}) => theme.spacing.xxlarge}px 0;
`;

export const ContentRow = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Content = styled.View`
  flex-direction: column;
  justify-content: center;
  margin-left: ${({theme}) => theme.spacing.small}px;
`;

export const ContainerMore = styled.View`
  margin-top: ${({theme}) => theme.spacing.xlarge}px;
`;

export const ContainerAvaliations = styled.ScrollView`
  width: 100%;
  flex-direction: column;
  margin: ${({theme}) => theme.spacing.xlarge}px 0;

  border-top-color: ${({theme}) => shade(0.08, theme.colors.background_global)};
  border-top-width: 1px;
`;

export const ContainerAvaliationsContent = styled.View`
  width: 100%;
  flex-direction: column;
  flex-wrap: wrap;
  margin: ${({theme}) => theme.spacing.small}px 0;

  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) =>
    shade(0.08, theme.colors.background_global)};
`;

export const ContainerAvaliationsContentItem = styled.View`
  width: 100%;
  flex-direction: row;
  align-items: center;
  margin: ${({theme}) => theme.spacing.xlarge}px 0;
`;

export const HeaderComment = styled.View`
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const Subtitle = styled.Text`
  font-size: 12px;
`;

export const ViewTitle = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const ContentColumn = styled.View`
  flex-direction: column;
  width: 85%;
  margin: 0 ${({theme}) => theme.spacing.medium}px;
  padding-right: 20px;
`;
