import apiMain from '../../api/apiMain';
import { translate } from '../../../../client/locales';
import {
  DocumentsRepository,
  SendDocumentPayload,
  DocTypeConfig,
  UserDocSubmission,
} from '../../../../common/services/documents/types';
import { mergeDocumentsWithConfig } from '../../../../common/services/documents/mergeDocuments';
import { resolveDocStatusInfo } from '../../../../common/services/documents/docStatus';

interface DriverDocumentsRepositoryDeps {
  getDriverId: () => string | undefined;
  getUserTypeId: () => string | undefined;
}

/** Repositório de documentos do app do motorista — sempre array em getDocuments(), sempre throw em erro. */
export function createDriverDocumentsRepository(
  { getDriverId, getUserTypeId }: DriverDocumentsRepositoryDeps,
): DocumentsRepository {
  return {
    async getDocuments() {
      const [driverResponse, configResponse] = await Promise.all([
        apiMain.post('Driver/Find', { stdObject: [{ driverId: getDriverId() }] }),
        apiMain.get(`DocUserType/FindByUserType?userTypeId=${getUserTypeId()}`),
      ]);

      const userDocs: UserDocSubmission[] = driverResponse.data?.status
        ? driverResponse.data.data?.docsUser ?? []
        : [];
      const configs: DocTypeConfig[] = configResponse.data?.status
        ? configResponse.data.data ?? []
        : [];

      return mergeDocumentsWithConfig(configs, userDocs, statusId =>
        translate(resolveDocStatusInfo(statusId).labelKey),
      );
    },

    async sendDocument(payload: SendDocumentPayload) {
      const formData = new FormData();
      formData.append('docId', payload.docId);
      if (payload.text) formData.append('text', payload.text);
      if (payload.image) formData.append(`DOC_${payload.docId}`, payload.image as any);
      if (payload.pdf) formData.append(`PDF_${payload.docId}`, payload.pdf as any);

      const { data } = await apiMain.post('DocUser/Send', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 120000,
      });

      if (!data.status) {
        throw new Error(data.message || translate('errors.document_send_error'));
      }
    },
  };
}
