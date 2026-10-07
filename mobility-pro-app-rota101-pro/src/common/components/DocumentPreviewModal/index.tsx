import Feather from '@expo/vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { BottomSheetModal } from '../../../client/components/BottomSheetModal';
import { translate } from '../../../client/locales';
import {
  ScrollContent,
  TitleRow,
  IconBadge,
  Title,
  ImageContainer,
  DocumentImage,
  TextContainer,
  DocumentText,
  StatusCaption,
  ContentButton,
  CancelButton,
  CancelButtonText,
  ConfirmButton,
  ConfirmButtonText,
} from './styles';
import { DocumentPreviewModalProps } from './types';

export function DocumentPreviewModal({ visible, onClose, document, onEdit }: DocumentPreviewModalProps) {
  const theme = useTheme();
  const titleIcon = document.image ? 'image' : document.pdf ? 'file-text' : 'file';

  return (
    <BottomSheetModal visible={visible} onRequestClose={onClose}>
      <ScrollContent>
        <TitleRow>
          <IconBadge>
            <Feather name={titleIcon} size={RFValue(20)} color={theme.colors.primary} />
          </IconBadge>
          <Title numberOfLines={1}>{document.name}</Title>
        </TitleRow>

        {document.image && (
          <ImageContainer>
            <DocumentImage source={{ uri: document.image }} resizeMode="contain" />
          </ImageContainer>
        )}

        {!document.image && document.pdf && (
          <ImageContainer>
            <Feather name="file-text" size={RFValue(56)} color={theme.colors.primary} />
            <StatusCaption>{translate('clientDocuments.pdf_sent')}</StatusCaption>
          </ImageContainer>
        )}

        {!document.image && !document.pdf && !document.text && (
          <ImageContainer>
            <Feather name="file" size={RFValue(56)} color={theme.colors.grayLight} />
            <StatusCaption>{translate('clientDocuments.no_file_sent')}</StatusCaption>
          </ImageContainer>
        )}

        {document.text && (
          <TextContainer>
            <DocumentText>{document.text}</DocumentText>
          </TextContainer>
        )}

        <ContentButton>
          <CancelButton onPress={onClose} activeOpacity={0.7}>
            <Feather name="x" size={16} color={theme.colors.secondary} />
            <CancelButtonText>{translate('documents.close_button')}</CancelButtonText>
          </CancelButton>

          <ConfirmButton onPress={onEdit} activeOpacity={0.7}>
            <Feather name="edit-2" size={16} color={theme.colors.primaryText} />
            <ConfirmButtonText>{translate('clientDocuments.edit')}</ConfirmButtonText>
          </ConfirmButton>
        </ContentButton>
      </ScrollContent>
    </BottomSheetModal>
  );
}
