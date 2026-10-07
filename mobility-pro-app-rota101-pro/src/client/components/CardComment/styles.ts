import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  background-color: ${({theme}) => theme.colors.white};
  padding: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(12)}px;
`;

export const PhotoColumn = styled.View`
  align-items: center;
`;

export const ImageProfileButton = styled.TouchableOpacity`
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
`;

export const ImageProfile = styled.Image`
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
  border-radius: ${RFValue(32)}px;
  border-width: ${RFValue(2)}px;
  border-color: ${({theme}) => theme.colors.border_green};
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const DriverInfo = styled.View`
  flex: 1;
`;

export const NameUser = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DriverRatingBadge = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(4)}px;
  margin-top: ${RFValue(-10)}px;
  border-width: ${RFValue(1.5)}px;
  border-color: ${({theme}) => theme.colors.white};
  background-color: ${({theme}) => theme.colors.background_greenLight};
  border-radius: ${({theme}) => theme.borderRadius.xxlarge}px;
  padding: ${RFValue(3)}px ${({theme}) => theme.spacing.medium}px;
`;

export const DriverRatingText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.border_green};
`;

export const StarsCaption = styled.Text`
  margin-top: ${RFValue(4)}px;
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.grayLight};
`;

export const Divider = styled.View`
  height: 1px;
  background-color: ${({theme}) => theme.colors.border};
`;

export const DecisionRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const DecisionLabel = styled.Text`
  flex: 1;
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const DecisionActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(8)}px;
`;

export const DecisionIconButton = styled.TouchableOpacity`
  width: ${RFValue(30)}px;
  height: ${RFValue(30)}px;
  border-radius: ${RFValue(15)}px;
  align-items: center;
  justify-content: center;
`;

export const CommentLabel = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CommentBox = styled.TextInput.attrs(({theme}) => ({
  underlineColorAndroid: 'transparent',
  placeholderTextColor: theme.colors.placeholder,
  multiline: true,
  textAlignVertical: 'top',
}))`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: ${({theme}) => theme.spacing.medium}px;
  height: ${RFValue(70)}px;
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContainerButtons = styled.View`
  flex-direction: row;
  gap: ${({theme}) => theme.spacing.medium}px;
`;

export const FavoriteButton = styled.TouchableOpacity<{disabled?: boolean}>`
  flex: 1;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${RFValue(6)}px;
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: ${({theme}) => theme.spacing.large}px;
  opacity: ${({disabled}) => (disabled ? 0.5 : 1)};
`;

export const FavoriteButtonText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.black};
`;

export const TipButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: ${({theme}) => theme.spacing.large}px;
`;

export const TipButtonText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.white};
`;

export const BackgroundTip = styled.View`
  margin-bottom: ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  width: 100%;
  z-index: -1;
`;
