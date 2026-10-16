import apiMain from '~/client/api/apiMain';
import { translate } from '~/client/locales';

const USER_TYPE_ID = 5;

export const DOC_STATUS = {
  APPROVED: 'APROVADO',
  NOT_SENT: 'NAO_ENVIADO',
} as const;

export const DOC_STATUS_ID = {
  APPROVED: '1',
  NOT_SENT: '0',
} as const;

interface DocumentValidationResult {
  isValid: boolean;
  message: string | null;
  type: 'not_sent' | 'not_approved' | 'error' | null;
}

export const areAllDocumentsApproved = (docs: any[]): boolean =>
  docs.length > 0 &&
  docs.every(
    (doc) =>
      doc.docStatus === DOC_STATUS.APPROVED ||
      doc.docStatusId === DOC_STATUS_ID.APPROVED,
  );

export const validateDocumentsEnhanced = async (
  userData: any,
): Promise<DocumentValidationResult> => {
  try {
    const response = await apiMain.get('DocUserType/FindByUserType', {
      params: { userTypeId: USER_TYPE_ID },
    });

    const configuredDocs = response?.data?.data || [];

    if (configuredDocs.length === 0) {
      return { isValid: true, message: null, type: null };
    }

    const userSentDocs = userData?.docsUser || [];

    const mappedDocs = configuredDocs.map((configDoc) => {
      const sentDoc = userSentDocs.find((doc) => doc.docId === configDoc.docId);
      return (
        sentDoc || {
          docId: configDoc.docId,
          docStatus: DOC_STATUS.NOT_SENT,
          docStatusId: DOC_STATUS_ID.NOT_SENT,
        }
      );
    });

    const notSentDocs = mappedDocs.filter(
      (doc) =>
        doc.docStatus === DOC_STATUS.NOT_SENT ||
        doc.docStatusId === DOC_STATUS_ID.NOT_SENT,
    );

    if (notSentDocs.length > 0) {
      return {
        isValid: false,
        message: translate('trip.alert_document_not_sent'),
        type: 'not_sent',
      };
    }

    const notApprovedDocs = mappedDocs.filter(
      (doc) =>
        doc.docStatus !== DOC_STATUS.APPROVED &&
        doc.docStatusId !== DOC_STATUS_ID.APPROVED,
    );

    if (notApprovedDocs.length > 0) {
      return {
        isValid: false,
        message: translate('trip.alert_document_not_approved'),
        type: 'not_approved',
      };
    }

    return { isValid: true, message: null, type: null };
  } catch (error) {
    return {
      isValid: false,
      message: translate('trip.alert_document_missing'),
      type: 'error',
    };
  }
};
