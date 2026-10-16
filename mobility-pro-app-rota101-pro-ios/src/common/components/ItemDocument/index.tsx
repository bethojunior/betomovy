import { useState } from 'react';
import { ActivityIndicator } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../client/locales';
import { resolveDocStatusInfo } from '../../services/documents/docStatus';
import { IconBadge } from '../IconBadge';
import { StatusBadge } from '../TripDetail/StatusBadge';
import { DocumentPreviewModal } from '../DocumentPreviewModal';
import { Container, ContentDoc, Doc, Description } from './styles';
import { ItemDocumentProps } from './types';

/** O backend manda o nome do documento em CAIXA ALTA — normaliza só na exibição, sem tocar no dado. */
const toDisplayLabel = (value: string) =>
  value.toLowerCase().replace(/(^|\s)\p{L}/gu, char => char.toUpperCase());

export function ItemDocument({
  label,
  docStatusId,
  docStatus,
  hasDocument,
  image,
  text,
  pdf,
  loading,
  onPress,
  testID,
  isLast = false,
}: ItemDocumentProps) {
  const { colors } = useTheme();
  const [showPreview, setShowPreview] = useState(false);
  const statusInfo = resolveDocStatusInfo(docStatusId);

  const handlePress = () => {
    if (!hasDocument) {
      onPress();
      return;
    }
    if (image || text || pdf) {
      setShowPreview(true);
      return;
    }
    onPress();
  };

  return (
    <>
      <Container testID={testID} isLast={isLast} activeOpacity={0.8} onPress={handlePress}>
        <IconBadge
          shape="square"
          color={colors.primary}
          // nome do ícone vem de config (string), não do union gerado do pacote de ícones
          icon={color => <MaterialCommunityIcons name={statusInfo.icon as any} size={RFValue(24)} color={color} />}
        />

        <ContentDoc>
          <Doc numberOfLines={2}>{toDisplayLabel(label)}</Doc>
          <StatusBadge label={docStatus} variant={statusInfo.variant} />
          <Description>{translate(statusInfo.descriptionKey)}</Description>
        </ContentDoc>

        {loading ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={RFValue(28)} color={colors.grayLight} />
        )}
      </Container>

      <DocumentPreviewModal
        visible={showPreview}
        onClose={() => setShowPreview(false)}
        document={{ name: label, image, text, pdf }}
        onEdit={() => {
          setShowPreview(false);
          onPress();
        }}
      />
    </>
  );
}
