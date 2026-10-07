import {Dialog as DialoContent, Paragraph, Portal} from 'react-native-paper';
import {translate} from '../../locales';
import {styleDialog, ButtonDialog, TextButtonDialog} from './styles';
import theme from '../../styles/theme';

interface DialogProps {
  visibleDialog?: boolean;
  setVisible?: () => void;
  title?: string;
  paragraph?: string;
  paragraphLineTwo?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function Dialog({
  visibleDialog,
  setVisible,
  title,
  paragraph,
  paragraphLineTwo,
  onConfirm,
  onCancel,
}: DialogProps) {
  return (
    <Portal>
      <DialoContent
        visible={visibleDialog || false}
        style={[styleDialog.container, {backgroundColor: theme.colors.background_global}]}
        onDismiss={setVisible}
      >
        <DialoContent.Title style={styleDialog.title}>
          {title}
        </DialoContent.Title>
        <DialoContent.Content>
          <Paragraph style={styleDialog.text}>{paragraph}</Paragraph>
          <Paragraph style={styleDialog.text}>{paragraphLineTwo}</Paragraph>
        </DialoContent.Content>
        <DialoContent.Actions>
          <ButtonDialog onPress={onCancel}>
            <TextButtonDialog>{translate('dialog.cancel')}</TextButtonDialog>
          </ButtonDialog>
          <ButtonDialog onPress={onConfirm}>
            <TextButtonDialog>{translate('dialog.confirm')}</TextButtonDialog>
          </ButtonDialog>
        </DialoContent.Actions>
      </DialoContent>
    </Portal>
  );
}
