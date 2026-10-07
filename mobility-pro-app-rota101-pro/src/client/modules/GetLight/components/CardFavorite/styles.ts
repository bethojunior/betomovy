import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_white_light};
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Avatar = styled.Image`
  width: 50px;
  height: 50px;
  border-radius: 25px;
`;

export const ContainerColumn = styled.View`
  margin-left: 10px;
  justify-content: space-between;
  flex: 1;
  align-items: center;
  margin: 0 10px;
`;

export const Text = styled.Text`
  font-size: 16px;
  color: ${({theme}) => theme.colors.black};
`;

export const ContainerDialogRemove = styled.View`
  width: 100%;
  height: 150px;
  border-radius: 5px;
  margin: ${({theme}) => theme.spacing.xslarge}px 0;
  padding: 0 ${({theme}) => theme.spacing.xslarge}px;
`;
