import { Dimensions, Platform } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

const { width } = Dimensions.get('window');

export const BackgroundContainer = styled.ImageBackground`
  flex: 1;
  width: 100%;
  height: 100%;
  background-color: #070b14;
`;

export const DarkOverlay = styled.View`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(6, 10, 20, 0.88);
`;

export const ScrollContainer = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    flexGrow: 1,
    paddingVertical: RFValue(18),
    paddingBottom: RFValue(36),
  },
  keyboardShouldPersistTaps: 'handled',
  showsVerticalScrollIndicator: false,
}))`
  flex: 1;
`;

export const ContentWrapper = styled.View`
  padding-horizontal: ${RFValue(20)}px;
  width: 100%;
`;

/* ===== HEADER SUPERIOR COM BOTÃO VOLTAR E TÍTULO ===== */
export const TopNavHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${Platform.OS === 'ios' ? RFValue(10) : RFValue(6)}px;
  margin-bottom: ${RFValue(14)}px;
  padding-horizontal: 4px;
`;

export const BackButton = styled.TouchableOpacity`
  width: ${RFValue(42)}px;
  height: ${RFValue(42)}px;
  border-radius: ${RFValue(21)}px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.15);
  align-items: center;
  justify-content: center;
`;

export const HeaderTitleContainer = styled.View`
  align-items: center;
  flex: 1;
  margin-horizontal: 8px;
`;

export const HeaderLogo = styled.Image`
  height: ${RFValue(38)}px;
  width: ${RFValue(130)}px;
  resize-mode: contain;
`;

export const HeaderSubtitle = styled.Text`
  font-size: ${RFValue(11)}px;
  color: #ff80ab;
  font-weight: 600;
  margin-top: 2px;
  letter-spacing: 0.4px;
`;

export const WebviewToggleBtn = styled.TouchableOpacity`
  padding-horizontal: 8px;
  padding-vertical: 6px;
  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.05);
`;

export const WebviewToggleText = styled.Text`
  font-size: ${RFValue(10)}px;
  color: rgba(255, 255, 255, 0.6);
`;

/* ===== SELEÇÃO DE PERFIL (PASSAGEIRO / MOTORISTA) ===== */
export const SelectedProfileBanner = styled.View<{ isDriver: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: ${({ isDriver }) =>
    isDriver ? 'rgba(0, 240, 255, 0.12)' : 'rgba(205, 35, 121, 0.15)'};
  border-width: 1.5px;
  border-color: ${({ isDriver }) => (isDriver ? '#00F0FF' : '#CD2379')};
  border-radius: ${RFValue(16)}px;
  padding: ${RFValue(12)}px ${RFValue(14)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const SelectedProfileLeft = styled.View`
  flex-direction: row;
  align-items: center;
  flex: 1;
`;

export const SelectedProfileIconBox = styled.View<{ isDriver: boolean }>`
  width: ${RFValue(42)}px;
  height: ${RFValue(42)}px;
  border-radius: ${RFValue(21)}px;
  background-color: ${({ isDriver }) => (isDriver ? '#00F0FF' : '#CD2379')};
  align-items: center;
  justify-content: center;
  margin-right: ${RFValue(10)}px;
`;

export const SelectedProfileTextBox = styled.View`
  flex: 1;
`;

export const SelectedProfileTitle = styled.Text<{ isDriver: boolean }>`
  font-size: ${RFValue(13)}px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 0.5px;
`;

export const SelectedProfileSubtitle = styled.Text<{ isDriver: boolean }>`
  font-size: ${RFValue(10)}px;
  color: ${({ isDriver }) => (isDriver ? '#00F0FF' : '#ff80ab')};
  margin-top: 1px;
`;

export const ChangeProfileButton = styled.TouchableOpacity<{ isDriver: boolean }>`
  padding-horizontal: ${RFValue(10)}px;
  padding-vertical: ${RFValue(7)}px;
  border-radius: ${RFValue(10)}px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.18);
  flex-direction: row;
  align-items: center;
`;

export const ChangeProfileButtonText = styled.Text`
  font-size: ${RFValue(10.5)}px;
  font-weight: 600;
  color: #ffffff;
  margin-left: 5px;
`;

export const ProfileGridContainer = styled.View`
  flex-direction: row;
  gap: 12px;
  margin-bottom: ${RFValue(16)}px;
`;

export const ProfileGridItem = styled.TouchableOpacity<{ active: boolean }>`
  flex: 1;
  background-color: ${({ active }) =>
    active ? 'rgba(205, 35, 121, 0.22)' : 'transparent'};
  border-width: ${({ active }) => (active ? '2px' : '1px')};
  border-color: ${({ active }) =>
    active ? '#CD2379' : 'rgba(255, 255, 255, 0.20)'};
  border-radius: ${RFValue(16)}px;
  padding-vertical: ${RFValue(12)}px;
  padding-horizontal: ${RFValue(10)}px;
  align-items: center;
  justify-content: center;
`;

export const ProfileIconBadge = styled.View<{ active: boolean }>`
  width: ${RFValue(40)}px;
  height: ${RFValue(40)}px;
  border-radius: ${RFValue(20)}px;
  background-color: ${({ active }) =>
    active ? '#CD2379' : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
  margin-bottom: 6px;
`;

export const ProfileGridTitle = styled.Text<{ active: boolean }>`
  font-size: ${RFValue(12)}px;
  font-weight: bold;
  color: ${({ active }) => (active ? '#ffffff' : 'rgba(255, 255, 255, 0.65)')};
  letter-spacing: 0.6px;
`;

export const ProfileGridSubtitle = styled.Text<{ active: boolean }>`
  font-size: ${RFValue(9.5)}px;
  color: ${({ active }) => (active ? '#ff80ab' : 'rgba(255, 255, 255, 0.40)')};
  margin-top: 1px;
`;

/* ===== INDICADOR DE PASSO A PASSO (STEP INDICATOR) ===== */
export const StepIndicatorContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-bottom: ${RFValue(18)}px;
  padding-horizontal: 8px;
`;

export const StepItemWrapper = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const StepCircle = styled.TouchableOpacity<{ active: boolean; completed: boolean }>`
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  background-color: ${({ completed, active }) =>
    completed
      ? '#CD2379'
      : active
      ? 'rgba(205, 35, 121, 0.35)'
      : 'rgba(255, 255, 255, 0.08)'};
  border-width: ${({ active }) => (active ? '2px' : '1px')};
  border-color: ${({ completed, active }) =>
    completed || active ? '#CD2379' : 'rgba(255, 255, 255, 0.20)'};
  align-items: center;
  justify-content: center;
`;

export const StepCircleText = styled.Text<{ active: boolean; completed: boolean }>`
  font-size: ${RFValue(12)}px;
  font-weight: bold;
  color: ${({ completed, active }) =>
    completed || active ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'};
`;

export const StepLine = styled.View<{ completed: boolean }>`
  width: ${RFValue(24)}px;
  height: 2px;
  background-color: ${({ completed }) =>
    completed ? '#CD2379' : 'rgba(255, 255, 255, 0.15)'};
  margin-horizontal: 4px;
`;

export const StepInfoLabel = styled.Text`
  font-size: ${RFValue(12)}px;
  font-weight: 600;
  color: #f1f5f9;
  text-align: center;
  margin-bottom: ${RFValue(12)}px;
`;

/* ===== CARD PRINCIPAL GLASSMORPHISM ===== */
export const GlassRegisterCard = styled.View`
  background-color: rgba(13, 19, 34, 0.88);
  border-width: 1px;
  border-color: rgba(255, 255, 255, 0.10);
  border-radius: ${RFValue(22)}px;
  padding: ${RFValue(20)}px ${RFValue(18)}px;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.45;
  shadow-radius: 20px;
  elevation: 8;
  margin-bottom: ${RFValue(14)}px;
`;

export const CardHeaderRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${RFValue(16)}px;
`;

export const CardHeaderPill = styled.View`
  flex-direction: row;
  align-items: center;
  background-color: rgba(205, 35, 121, 0.22);
  border-radius: 20px;
  padding-horizontal: 10px;
  padding-vertical: 4px;
  border-width: 1px;
  border-color: rgba(205, 35, 121, 0.5);
`;

export const CardHeaderPillText = styled.Text`
  font-size: ${RFValue(11)}px;
  font-weight: 600;
  color: #ff80ab;
  margin-left: 6px;
  letter-spacing: 0.3px;
`;

export const StepCounterBadge = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.5);
  font-weight: 600;
`;

/* ===== INPUTS MODERNOS ESCUROS ===== */
export const InputGroup = styled.View`
  margin-bottom: ${RFValue(13)}px;
`;

export const ModernInputLabel = styled.Text`
  font-size: ${RFValue(11.5)}px;
  font-weight: 600;
  color: #f1f5f9;
  margin-bottom: 5px;
`;

export const ModernInputBox = styled.View<{ hasError?: boolean; isFocused?: boolean }>`
  flex-direction: row;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1.5px;
  border-color: ${({ hasError, isFocused }) =>
    hasError
      ? '#ef4444'
      : isFocused
      ? '#CD2379'
      : 'rgba(255, 255, 255, 0.12)'};
  border-radius: ${RFValue(12)}px;
  padding-horizontal: 12px;
  height: ${RFValue(48)}px;
`;

export const ModernTextInput = styled.TextInput`
  flex: 1;
  font-size: ${RFValue(13.5)}px;
  color: #ffffff;
  padding-left: 8px;
  padding-right: 8px;
`;

export const InputErrorText = styled.Text`
  font-size: ${RFValue(10)}px;
  color: #ef4444;
  margin-top: 3px;
`;

/* ===== CARDS DE SELEÇÃO DE CATEGORIA DE MOTORISTA ===== */
export const CategoryOptionCard = styled.TouchableOpacity<{ isSelected: boolean }>`
  background-color: ${({ isSelected }) =>
    isSelected ? 'rgba(205, 35, 121, 0.20)' : 'rgba(255, 255, 255, 0.04)'};
  border-width: ${({ isSelected }) => (isSelected ? '2px' : '1px')};
  border-color: ${({ isSelected }) =>
    isSelected ? '#CD2379' : 'rgba(255, 255, 255, 0.12)'};
  border-radius: ${RFValue(14)}px;
  padding: ${RFValue(14)}px;
  margin-bottom: ${RFValue(10)}px;
  flex-direction: row;
  align-items: center;
`;

export const CategoryIconContainer = styled.View<{ isSelected: boolean }>`
  width: ${RFValue(48)}px;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(12)}px;
  background-color: ${({ isSelected }) =>
    isSelected ? '#CD2379' : 'rgba(255, 255, 255, 0.08)'};
  align-items: center;
  justify-content: center;
  margin-right: 12px;
`;

export const CategoryInfoCol = styled.View`
  flex: 1;
`;

export const CategoryTitle = styled.Text<{ isSelected: boolean }>`
  font-size: ${RFValue(14)}px;
  font-weight: bold;
  color: ${({ isSelected }) => (isSelected ? '#ffffff' : '#e2e8f0')};
`;

export const CategoryDescription = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.55);
  margin-top: 2px;
`;

export const CategoryCheckBadge = styled.View<{ isSelected: boolean }>`
  width: ${RFValue(24)}px;
  height: ${RFValue(24)}px;
  border-radius: ${RFValue(12)}px;
  background-color: ${({ isSelected }) =>
    isSelected ? '#CD2379' : 'transparent'};
  border-width: 1.5px;
  border-color: ${({ isSelected }) =>
    isSelected ? '#CD2379' : 'rgba(255, 255, 255, 0.25)'};
  align-items: center;
  justify-content: center;
  margin-left: 8px;
`;

/* ===== BOTÕES DE AÇÃO (AVANÇAR / VOLTAR) ===== */
export const ButtonActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: ${RFValue(12)}px;
`;

export const BackStepButton = styled.TouchableOpacity`
  flex: 1;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(12)}px;
  border-width: 1.5px;
  border-color: rgba(255, 255, 255, 0.20);
  background-color: transparent;
  align-items: center;
  justify-content: center;
  flex-direction: row;
`;

export const BackStepButtonText = styled.Text`
  font-size: ${RFValue(13)}px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  margin-left: 6px;
`;

export const NextStepButton = styled.TouchableOpacity<{ disabled?: boolean }>`
  flex: 2;
  height: ${RFValue(48)}px;
  border-radius: ${RFValue(12)}px;
  background-color: ${({ disabled }) => (disabled ? '#64748b' : '#CD2379')};
  align-items: center;
  justify-content: center;
  flex-direction: row;
  shadow-color: #CD2379;
  shadow-offset: 0px 4px;
  shadow-opacity: 0.4;
  shadow-radius: 8px;
  elevation: 4;
`;

export const NextStepButtonText = styled.Text`
  font-size: ${RFValue(13.5)}px;
  font-weight: bold;
  color: #ffffff;
  letter-spacing: 0.5px;
  margin-right: 6px;
`;

/* ===== TELA DE SUCESSO DO CADASTRO ===== */
export const SuccessContainer = styled.View`
  align-items: center;
  padding-vertical: ${RFValue(16)}px;
`;

export const SuccessIconBadge = styled.View`
  width: ${RFValue(64)}px;
  height: ${RFValue(64)}px;
  border-radius: ${RFValue(32)}px;
  background-color: rgba(34, 197, 94, 0.20);
  border-width: 2px;
  border-color: #22c55e;
  align-items: center;
  justify-content: center;
  margin-bottom: ${RFValue(14)}px;
`;

export const SuccessTitle = styled.Text`
  font-size: ${RFValue(17)}px;
  font-weight: bold;
  color: #ffffff;
  text-align: center;
  margin-bottom: 6px;
`;

export const SuccessDescription = styled.Text`
  font-size: ${RFValue(12)}px;
  color: rgba(255, 255, 255, 0.65);
  text-align: center;
  line-height: ${RFValue(18)}px;
  margin-bottom: ${RFValue(20)}px;
  padding-horizontal: 10px;
`;

/* ===== DROPDOWN MODAL DE CIDADES ===== */
export const DropdownButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(255, 255, 255, 0.06);
  border-width: 1.5px;
  border-color: rgba(255, 255, 255, 0.12);
  border-radius: ${RFValue(12)}px;
  padding-horizontal: 14px;
  height: ${RFValue(48)}px;
`;

export const DropdownButtonText = styled.Text<{ hasValue: boolean }>`
  font-size: ${RFValue(13.5)}px;
  color: ${({ hasValue }) => (hasValue ? '#ffffff' : 'rgba(255, 255, 255, 0.35)')};
`;

/* ===== COMPONENTES DE FOTO DE PERFIL ===== */
export const PhotoUploadSection = styled.View`
  align-items: center;
  margin-bottom: ${RFValue(18)}px;
  padding-vertical: ${RFValue(6)}px;
`;

export const PhotoAvatarWrapper = styled.TouchableOpacity`
  position: relative;
  align-items: center;
  justify-content: center;
  margin-bottom: ${RFValue(12)}px;
`;

export const PhotoAvatarImage = styled.Image`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: ${RFValue(50)}px;
  border-width: 3px;
  border-color: #CD2379;
`;

export const PhotoAvatarPlaceholder = styled.View`
  width: ${RFValue(100)}px;
  height: ${RFValue(100)}px;
  border-radius: ${RFValue(50)}px;
  background-color: rgba(255, 255, 255, 0.08);
  border-width: 2px;
  border-color: rgba(255, 255, 255, 0.25);
  border-style: dashed;
  align-items: center;
  justify-content: center;
`;

export const PhotoCameraBadge = styled.View`
  position: absolute;
  bottom: 0;
  right: 0;
  width: ${RFValue(32)}px;
  height: ${RFValue(32)}px;
  border-radius: ${RFValue(16)}px;
  background-color: #CD2379;
  border-width: 2px;
  border-color: #0d1322;
  align-items: center;
  justify-content: center;
`;

export const PhotoActionsRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin-top: 4px;
`;

export const PhotoChoiceButton = styled.TouchableOpacity<{ variant?: 'camera' | 'gallery' }>`
  flex-direction: row;
  align-items: center;
  background-color: ${({ variant }) =>
    variant === 'camera' ? 'rgba(205, 35, 121, 0.25)' : 'rgba(255, 255, 255, 0.08)'};
  border-width: 1px;
  border-color: ${({ variant }) =>
    variant === 'camera' ? '#CD2379' : 'rgba(255, 255, 255, 0.20)'};
  border-radius: ${RFValue(10)}px;
  padding-horizontal: ${RFValue(14)}px;
  padding-vertical: ${RFValue(8)}px;
`;

export const PhotoChoiceButtonText = styled.Text`
  font-size: ${RFValue(11.5)}px;
  color: #ffffff;
  font-weight: 600;
  margin-left: 6px;
`;

export const PhotoRemoveBtn = styled.TouchableOpacity`
  margin-top: ${RFValue(8)}px;
  padding-vertical: 4px;
`;

export const PhotoRemoveBtnText = styled.Text`
  font-size: ${RFValue(10.5)}px;
  color: #ef4444;
  font-weight: 500;
`;

export const PhotoTipText = styled.Text`
  font-size: ${RFValue(11)}px;
  color: rgba(255, 255, 255, 0.55);
  text-align: center;
  margin-top: 4px;
`;
