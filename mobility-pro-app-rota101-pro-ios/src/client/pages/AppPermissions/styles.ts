import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import { Button } from '../../components/Button';

export const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.background_global};
`;

export const ContentPage = styled.View``;

export const ContentPageScroll = styled.ScrollView.attrs({
  contentContainerStyle: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
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
  margin-top: 16px;
  margin-bottom: 28px;
`;

export const Description = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({ theme }) => theme.fonts.regular};
  color: ${({ theme }) => theme.colors.secondary};
  line-height: ${RFValue(20)}px;
  text-align: justify;
  margin-bottom: 10px;
`;

export const ContentButtons = styled.View`
  width: 100%;
  justify-content: space-around;
  margin-top: 15px;
  margin-bottom: 25px;
  gap: 10px;
`;
