import styled from 'styled-components/native';

export const MapSettingButton = styled.Pressable`
  position: absolute;
  top: 10px;
  left: 130px;
  background-color: #ddd;
  padding: 10px;
  z-index: 1;
`;

export const MapSettingModal = styled.Modal`
  flex: 1;
`;

export const MapSettingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  /* background-color: rgba(0, 0, 0, 0.5); */
`;

export const MapSettingContent = styled.View`
  width: 80%;
  /* margin-right: 20px; */
  margin-top: -80px;
  padding: 20px 10px;
  background-color: #111dfce6;
  align-items: center;
  opacity: 0.8;
  border-radius: 15px;
`;

export const MapSettingTextInput = styled.TextInput`
  border: 1px solid #ddd;
  padding: 5px;
  margin-bottom: 10px;
`;

export const MapSettingSaveButton = styled.Pressable`
  background-color: #81d4fa;
  padding: 10px;
  z-index: 1;
  align-items: center;
`;
