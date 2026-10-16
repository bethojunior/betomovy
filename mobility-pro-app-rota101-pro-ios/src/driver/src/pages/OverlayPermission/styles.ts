import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Button } from '../../components/Button';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const ContentPage = styled.View`
  flex: 1;
`;

export const ContentPageScroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: RFValue(20),
    paddingTop: RFValue(20),
  },
})``;

export const ContentPermission = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const Title = styled.Text`
  font-size: ${RFValue(27)}px;
  font-family: ${({ theme }) => theme.fonts.medium};
  color: ${({ theme }) => theme.colors.secondary};
  text-align: center;
  margin-top: ${RFValue(16)}px;
  margin-bottom: ${RFValue(28)}px;
`;

export const Description = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${RFValue(20)}px;
  text-align: justify;
  margin-bottom: ${RFValue(10)}px;
`;

export const ContentButtons = styled.View`
  flex-direction: row;
  justify-content: space-around;
  margin-top: ${RFValue(15)}px;
  margin-bottom: ${RFValue(25)}px;
`;

export const PermissionButton = styled(Button)``;
