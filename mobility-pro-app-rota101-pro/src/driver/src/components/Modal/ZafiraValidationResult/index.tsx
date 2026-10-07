import React from 'react';
import { View, Image, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import ModalFrame from '../ModalFrame';
import { translate } from '../../../../../client/locales';
import { ZafiraValidationResultModalProps, ZafiraApiData } from './types';
import {
  ZAFIRA_COLORS,
  MODAL_SIZE as ZAFIRA_MODAL_SIZE,
} from './constants';
import { resolveZafiraDisplayMessage } from '../../../services/zafiraService';
import { useZafiraModalLayout } from './useZafiraModalLayout';
import { createZafiraModalStyles } from './styles';

export const ZafiraValidationResultModal: React.FC<ZafiraValidationResultModalProps> = ({
  visible,
  setVisible,
  isMatch,
  apiData,
  error,
}) => {
  const layout = useZafiraModalLayout();
  const styles = React.useMemo(() => createZafiraModalStyles(layout), [layout]);

  const handleClose = (): void => setVisible(false);

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={handleClose}
      hideCancel
      hideConfirm
      scrollable
      closeIcon
      closeIconColor={ZAFIRA_COLORS.text}
      closeIconSize={18}
      closeIconTransparent
      contentBackgroundColor={ZAFIRA_COLORS.background}
      contentContainerStyle={styles.contentContainer}
      contentStyle={styles.modalContent}
      contentMinHeightPercent={ZAFIRA_MODAL_SIZE.minHeightPercent}
      contentMaxHeightPercent={ZAFIRA_MODAL_SIZE.maxHeightPercent}
    >
      <View style={styles.container}>
        <ZafiraModalHeader styles={styles} />
        <View style={styles.body}>
          {error ? (
            <ZafiraErrorContent error={error} layout={layout} styles={styles} />
          ) : (
            <ZafiraSuccessContent
              isMatch={isMatch}
              apiData={apiData}
              layout={layout}
              styles={styles}
            />
          )}
        </View>
      </View>
    </ModalFrame>
  );
};

/** Header with Zafira logo */
function ZafiraModalHeader({
  styles,
}: {
  styles: ReturnType<typeof createZafiraModalStyles>;
}) {
  return (
    <View style={styles.header}>
      <Image
        source={require('../../../../../../assets/zafira/zafira-logo.jpg')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const VALIDATION_ERROR_KEY = 'doorHandle.validation_error';

function isRawServerError(error: string): boolean {
  if (!error || error === VALIDATION_ERROR_KEY) return false;
  return (
    /Server error|500|502|503|Internal Server Error|validar-dados|resulted in|Action não existe|Action nao existe|Action does not exist|Action no existe/i.test(error) ||
    error.includes('missing') ||
    error.includes('translation')
  );
}

/** Error state: icon + message (responsive typography and layout) */
function ZafiraErrorContent({
  error,
  layout,
  styles,
}: {
  error: string;
  layout: ReturnType<typeof useZafiraModalLayout>;
  styles: ReturnType<typeof createZafiraModalStyles>;
}) {
  const displayMessage = isRawServerError(error)
    ? translate(VALIDATION_ERROR_KEY)
    : resolveZafiraDisplayMessage(error);
  const errorFontSize = layout.typography.body;
  return (
    <View style={styles.errorContainer}>
      <View style={[styles.statusIconWrapper, styles.statusIconError]}>
        <Ionicons
          name="close-circle"
          size={layout.icon.status}
          color={ZAFIRA_COLORS.error}
        />
      </View>
      <View style={styles.errorMessageBlock}>
        <Text style={[styles.errorMessageText, { fontSize: errorFontSize }]}>
          {displayMessage}
        </Text>
      </View>
    </View>
  );
}

/** One row of the details card: icon + label + value */
function DetailRow({
  icon,
  label,
  value,
  emphasis,
  last,
  layout,
  styles,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  emphasis?: boolean;
  last?: boolean;
  layout: ReturnType<typeof useZafiraModalLayout>;
  styles: ReturnType<typeof createZafiraModalStyles>;
}) {
  return (
    <View style={last ? styles.detailRowLast : styles.detailRow}>
      <View style={styles.detailIconWrap}>
        <Ionicons name={icon} size={layout.icon.detail} color={ZAFIRA_COLORS.textMuted} />
      </View>
      <View style={styles.detailContent}>
        <Text style={[styles.detailLabel, { fontSize: layout.typography.label }]} numberOfLines={1}>
          {label}
        </Text>
        <Text
          style={[
            emphasis ? styles.detailValueEmphasis : styles.detailValue,
            { fontSize: emphasis ? layout.typography.body * 1.15 : layout.typography.body },
          ]}
          numberOfLines={emphasis ? 2 : 1}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

/** Success state: status icon + title + single details card */
function ZafiraSuccessContent({
  isMatch,
  apiData,
  layout,
  styles,
}: {
  isMatch: boolean;
  apiData?: ZafiraApiData | null;
  layout: ReturnType<typeof useZafiraModalLayout>;
  styles: ReturnType<typeof createZafiraModalStyles>;
}) {
  const { typography } = layout;

  return (
    <>
      <View
        style={[
          styles.statusIconWrapper,
          isMatch ? styles.statusIconSuccess : styles.statusIconError,
        ]}
      >
        <Ionicons
          name={isMatch ? 'checkmark-circle' : 'close-circle'}
          size={layout.icon.status}
          color={isMatch ? ZAFIRA_COLORS.success : ZAFIRA_COLORS.error}
        />
      </View>

      {apiData && (
        <>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { fontSize: typography.title }]} numberOfLines={2}>
              {translate('doorHandle.registration_found')}
            </Text>
          </View>
          <View style={styles.subtitleBlock}>
            <Text
              style={[styles.subtitle, { fontSize: typography.subtitle }]}
              numberOfLines={3}
            >
              {translate('doorHandle.validate_data_with_customer')}
            </Text>
          </View>

          <View style={styles.detailsCard}>
            <DetailRow
              icon="person-outline"
              label={translate('doorHandle.name')}
              value={apiData.nome}
              emphasis
              layout={layout}
              styles={styles}
            />
            <DetailRow
              icon="document-text-outline"
              label={translate('doorHandle.cpf_label')}
              value={apiData.cpf}
              layout={layout}
              styles={styles}
            />
            <DetailRow
              icon="woman-outline"
              label={translate('doorHandle.mothers_name')}
              value={apiData.mae}
              layout={layout}
              styles={styles}
            />
            <DetailRow
              icon="calendar-outline"
              label={translate('doorHandle.birth_date')}
              value={apiData.nascimento}
              last
              layout={layout}
              styles={styles}
            />
          </View>

          <View style={styles.footer}>
            <Ionicons name="lock-closed-outline" size={layout.icon.footer} color={ZAFIRA_COLORS.textSubtle} />
            <Text style={[styles.footerText, { fontSize: typography.footer }]}>
              {translate('doorHandle.data_protected_footer')}
            </Text>
          </View>
        </>
      )}
    </>
  );
}
