import { DocTypeConfig, UserDocSubmission, DocumentListItem, DocStatusId } from './types';

export type DocStatusLabelResolver = (
  statusId: DocStatusId,
  hasDocument: boolean,
) => string;

/** Junta a config de tipos de documento com os documentos já enviados pelo usuário. */
export function mergeDocumentsWithConfig(
  configs: DocTypeConfig[],
  userDocs: UserDocSubmission[],
  resolveLabel: DocStatusLabelResolver,
): DocumentListItem[] {
  return configs.map(config => {
    const submitted = userDocs.find(doc => doc.docId?.toString() === config.docId?.toString());
    const statusId = (submitted?.docStatusId ?? '0') as DocStatusId;
    const hasDocument = Boolean(submitted);

    return {
      docId: config.docId,
      label: config.label,
      description: config.description ?? null,
      docStatusId: statusId,
      docStatus: submitted?.docStatus || resolveLabel(statusId, hasDocument),
      hasDocument,
      image: submitted?.image && submitted.image !== '0' ? submitted.image : null,
      text: submitted?.text ?? null,
      pdf: hasDocument && config.pdf === '1' ? (submitted?.pdf ?? 'PDF_ENVIADO') : null,
      config: { pdf: config.pdf, text: config.text, image: config.image },
    };
  });
}
