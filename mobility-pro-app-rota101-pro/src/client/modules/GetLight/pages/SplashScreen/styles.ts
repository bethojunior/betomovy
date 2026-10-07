import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
  flex-direction: column;
  justify-content: center;
  width: 100%;
  height: 100%;
  z-index: 100;
  padding: 0 ${({theme}) => theme.spacing.xlarge}px;
`;
export const ContainerAd = styled.Image`
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
  width: 100%;
  height: ${RFValue(115)}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const Text = styled.Text`
  color: ${({theme}) => theme.colors.white};
  font-size: ${({theme}) => theme.fontSizes.medium}px;
`;
export const ContainerImage = styled.View`
  flex-direction: row;
  justify-content: center;
  width: 200px;
  height: 200px;
  margin: 0 auto;
`;

export const Image = styled.Image`
  width: 200px;
  height: 200px;
`;
export const ContainerTitle = styled.View`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
`;
export const Title = styled.Text`
  text-align: center;
  font-size: ${({theme}) => theme.fontSizes.extralarge}px;
  color: ${({theme}) => theme.colors.primary};
`;
export const Subtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xxlarge}px;
  text-align: center;
  color: ${({theme}) => theme.colors.primary};
`;
// export const Button = styled.TouchableOpacity`
//   position: absolute;
//   bottom: 0;
//   width: 100%;
//   padding: 10px;
//   background-color: ${theme.colors.primary};
//   display: flex;
//   align-items: center;
//   justify-content: center;
// `

export const ContainerButton = styled.View`
  margin-top: ${({theme}) => theme.spacing.xsslarge}%;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;
