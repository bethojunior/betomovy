import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-size: 20px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Subtitle = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const Content = styled.ScrollView`
  padding: 0 20px;
`;

export const TextArea = styled.TextInput.attrs({
  multiline: true,
  textAlignVertical: 'top',
})`
  height: 300px;
  background-color: ${({theme}) => theme.colors.border_white_light};
  border-radius: 10px;
  text-align: justify;
  border: 0.5px solid ${({theme}) => theme.colors.primary};
  padding: 12px;
  margin-top: 20px;
`;

export const ContentLogo = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const ContainerText = styled.View`
  align-items: center;
`;

export const Image = styled.Image`
  width: 150px;
  height: 150px;
`;

export const ViewButton = styled.View`
  width: 100%;
  height: 50px;
  margin-top: ${({theme}) => theme.spacing.xxlarge}px;
`;
