import apiMain from '../../api/apiMain';
import { translate } from '../../locales';
import {
  DocumentsRepository,
  SendDocumentPayload,
  DocTypeConfig,
  UserDocSubmission,
} from '../../../common/services/documents/types';
import { mergeDocumentsWithConfig } from '../../../common/services/documents/mergeDocuments';
import { resolveDocStatusInfo } from '../../../common/services/documents/docStatus';

const CUSTOMER_USER_TYPE_ID = '5';
const MAX_RETRIES = 2;

const isRetryableError = (error: any) =>
  error.code === 'ECONNABORTED' ||
  error.message?.includes('timeout') ||
  error.message?.includes('Network Error') ||
  error.response?.status >= 500;

const resolveErrorMessage = (error: any): string => {
  if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
    return 'Timeout no upload. Tente novamente.';
  }
  if (error.response?.status === 413) {
    return translate('errors.file_size_exceeded', { limitMB: 40 });
  }
  return error.response?.data?.message || error.message || translate('errors.document_send_error');
};

interface ClientDocumentsRepositoryDeps {
  getUserId: () => string | number | undefined;
}

/** Repositório de documentos do app do cliente — comportamento correto (retry, throw em erro, upload de arquivo). */
export function createClientDocumentsRepository(
  { getUserId }: ClientDocumentsRepositoryDeps,
): DocumentsRepository {
  return {
    async getDocuments() {
      const [userResponse, configResponse] = await Promise.all([
        apiMain.post('Customer/Find', { idUser: getUserId() }),
        apiMain.get(`DocUserType/FindByUserType?userTypeId=${CUSTOMER_USER_TYPE_ID}`),
      ]);

      const userDocs: UserDocSubmission[] = userResponse.data?.status
        ? userResponse.data.data?.docsUser ?? []
        : [];
      const configs: DocTypeConfig[] = configResponse.data?.status
        ? configResponse.data.data ?? []
        : [];

      return mergeDocumentsWithConfig(configs, userDocs, statusId =>
        translate(resolveDocStatusInfo(statusId).labelKey),
      );
    },

    sendDocument: sendDocumentWithRetry,
  };
}

async function sendDocumentWithRetry(payload: SendDocumentPayload, retryCount = 0): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('docId', payload.docId);

    if (payload.text) {
      formData.append('text', payload.text);
    }
    if (payload.image) {
      formData.append(`DOC_${payload.docId}`, payload.image as any);
    }
    if (payload.pdf) {
      formData.append(`PDF_${payload.docId}`, payload.pdf as any);
    }

    const response = await apiMain.post('DocUser/Send', formData, {
      headers: { Accept: 'application/json', 'Content-Type': 'multipart/form-data' },
      timeout: 120000,
    });

    if (!response.data.status) {
      throw new Error(response.data.message || translate('errors.document_send_error'));
    }
  } catch (error: any) {
    if (retryCount < MAX_RETRIES && isRetryableError(error)) {
      await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
      return sendDocumentWithRetry(payload, retryCount + 1);
    }

    throw new Error(resolveErrorMessage(error));
  }
}
