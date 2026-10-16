export interface RouteParams {
  params: {
    doc: {
      docId: string;
      label: string;
      text?: string | null;
      hasDocument?: boolean;
    };
    docConfig: {
      text: string;
      pdf: string;
      image: string;
    };
    onDocumentUpdated?: () => void;
  };
}

export interface DocumentSendPageProps {
  route: RouteParams;
}