import { StyleSheet } from 'react-native';
import { ZafiraModalLayout } from './useZafiraModalLayout';
import { ZAFIRA_COLORS } from './constants';

export function createZafiraModalStyles(layout: ZafiraModalLayout) {
  const { spacing, icon, padding, modal, radius } = layout;

  return StyleSheet.create({
    // Layout responsivo: cresce com o conteúdo (sem flex:1, senão o
    // ScrollView fica preso na altura do container pai e o que passar
    // do limite some, já que o scroll interno está desligado)
    modalContent: {
      width: '100%',
      alignSelf: 'center',
      minHeight: modal.minHeight,
    },
    contentContainer: {
      paddingHorizontal: padding.horizontal,
      paddingTop: padding.vertical,
      paddingBottom: spacing.xs,
      justifyContent: 'flex-start',
    },
    container: {
      paddingTop: spacing.xs,
      paddingBottom: 0,
      paddingHorizontal: spacing.sm,
    },

    // Header (logo)
    header: {
      alignItems: 'center',
      paddingBottom: spacing.xs,
    },
    logo: {
      width: icon.logoW,
      height: icon.logoH,
    },

    // Body - View que envolve o conteúdo (sem scroll)
    body: {
      alignItems: 'center',
      paddingBottom: 0,
    },

    // Status icon (success/error)
    statusIconWrapper: {
      alignItems: 'center',
      justifyContent: 'center',
      width: icon.statusContainer,
      height: icon.statusContainer,
      borderRadius: icon.statusContainer / 2,
      marginBottom: spacing.xs,
    },
    statusIconSuccess: {
      backgroundColor: ZAFIRA_COLORS.successSurface,
    },
    statusIconError: {
      backgroundColor: ZAFIRA_COLORS.errorSurface,
    },

    // Title / subtitle
    titleBlock: {
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    title: {
      fontWeight: '700',
      color: ZAFIRA_COLORS.text,
      textAlign: 'center',
    },
    subtitleBlock: {
      marginTop: 2,
      marginBottom: spacing.sm,
      alignItems: 'center',
      paddingHorizontal: spacing.md,
    },
    subtitle: {
      fontWeight: '400',
      color: ZAFIRA_COLORS.textSubtle,
      textAlign: 'center',
      lineHeight: layout.typography.subtitle * 1.3,
    },

    // Card único com os dados do cliente
    detailsCard: {
      width: '100%',
      backgroundColor: ZAFIRA_COLORS.surface,
      borderRadius: radius * 1.5,
      borderWidth: 1,
      borderColor: ZAFIRA_COLORS.borderLight,
      paddingHorizontal: spacing.sm,
      overflow: 'hidden',
    },
    detailRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      borderBottomWidth: 1,
      borderBottomColor: ZAFIRA_COLORS.borderLight,
    },
    detailRowLast: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.xs,
      borderBottomWidth: 0,
    },
    detailIconWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      width: icon.detailContainer,
      height: icon.detailContainer,
      borderRadius: icon.detailContainer / 2,
      backgroundColor: ZAFIRA_COLORS.iconSurface,
      marginRight: spacing.sm,
    },
    detailContent: {
      flex: 1,
    },
    detailLabel: {
      fontWeight: '500',
      color: ZAFIRA_COLORS.textSubtle,
      textTransform: 'uppercase',
      letterSpacing: 0.4,
      marginBottom: 1,
    },
    detailValue: {
      fontWeight: '500',
      color: ZAFIRA_COLORS.textMuted,
    },
    detailValueEmphasis: {
      fontWeight: '700',
      color: ZAFIRA_COLORS.text,
    },

    // Footer (dados protegidos)
    footer: {
      marginTop: spacing.sm,
      marginBottom: 0,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    footerText: {
      color: ZAFIRA_COLORS.textSubtle,
      marginLeft: 4,
      textAlign: 'center',
    },

    // Error state
    errorContainer: {
      alignItems: 'center',
      width: '100%',
      paddingHorizontal: spacing.sm,
    },
    errorMessageBlock: {
      marginTop: spacing.md,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
      backgroundColor: ZAFIRA_COLORS.errorSurface,
      borderRadius: radius,
      width: '100%',
      minHeight: 56,
    },
    errorMessageText: {
      color: ZAFIRA_COLORS.text,
      fontWeight: '500',
      textAlign: 'center',
    },
  });
}
