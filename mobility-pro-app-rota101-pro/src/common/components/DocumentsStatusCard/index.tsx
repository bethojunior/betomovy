import Feather from '@expo/vector-icons/Feather';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { IconBadge } from '../IconBadge';
import { translate } from '../../../client/locales';
import { Card, DocumentsLabel, DocumentsPendingText, DocumentsRow, DocumentsTextGroup } from './styles';
import { DocumentsStatusCardProps } from './types';

/**
 * Card de status de documentos — mesma composição já usada no StatusPending
 * do motorista (IconBadge + label + aviso de pendência + chevron), extraído
 * pra common pra ser reaproveitado também no cliente.
 */
export function DocumentsStatusCard({ hasPendingDocuments, onPress }: DocumentsStatusCardProps) {
  const theme = useTheme();

  return (
    <Card>
      <DocumentsRow activeOpacity={0.8} onPress={onPress}>
        <IconBadge
          color={theme.colors.primary}
          icon={color => <Feather name="folder" size={RFValue(20)} color={color} />}
        />
        <DocumentsTextGroup>
          <DocumentsLabel>{translate('driverStatus.label_documents')}</DocumentsLabel>
          {hasPendingDocuments && (
            <DocumentsPendingText>{translate('driverStatus.label_documents_pending')}</DocumentsPendingText>
          )}
        </DocumentsTextGroup>
        <Feather name="chevron-right" size={RFValue(22)} color={theme.colors.grayLight} />
      </DocumentsRow>
    </Card>
  );
}
