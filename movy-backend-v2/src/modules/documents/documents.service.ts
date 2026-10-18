import { Injectable, BadRequestException } from '@nestjs/common';

export interface DriverDocumentSubmissionDto {
  driver_id: number;
  doc_type:
    | 'driver_license_front'
    | 'driver_license_back'
    | 'vehicle_registration'
    | 'vehicle_insurance'
    | 'cnh'
    | 'crlv';
  document_url: string;
  country_code: 'US' | 'BR';
}

@Injectable()
export class DocumentsService {
  private documentQueue = new Map<number, any[]>([
    [
      1,
      [
        {
          id: 101,
          driver_id: 1,
          doc_type: 'driver_license_front',
          document_url: 'https://movy-storage.s3.amazonaws.com/docs/us_dl_front_carlos.jpg',
          country_code: 'US',
          status: 'approved',
          submitted_at: new Date('2026-10-15'),
          reviewed_at: new Date('2026-10-16'),
        },
        {
          id: 102,
          driver_id: 1,
          doc_type: 'vehicle_registration',
          document_url: 'https://movy-storage.s3.amazonaws.com/docs/us_registration_carlos.jpg',
          country_code: 'US',
          status: 'approved',
          submitted_at: new Date('2026-10-15'),
          reviewed_at: new Date('2026-10-16'),
        },
      ],
    ],
  ]);

  async submitDocument(dto: DriverDocumentSubmissionDto) {
    const docId = Math.floor(1000 + Math.random() * 9000);
    const newDoc = {
      id: docId,
      driver_id: dto.driver_id,
      doc_type: dto.doc_type,
      document_url: dto.document_url,
      country_code: dto.country_code,
      status: 'pending',
      submitted_at: new Date(),
    };

    const currentDocs = this.documentQueue.get(dto.driver_id) || [];
    currentDocs.push(newDoc);
    this.documentQueue.set(dto.driver_id, currentDocs);

    return {
      success: true,
      message: dto.country_code === 'US'
        ? 'Document uploaded successfully! Our compliance team will review within 24 hours.'
        : 'Documento enviado com sucesso! Análise em até 24 horas.',
      document: newDoc,
    };
  }

  async getDriverDocuments(driverId: number) {
    return this.documentQueue.get(driverId) || [];
  }

  async getPendingReviewQueue() {
    const allPending: any[] = [];
    this.documentQueue.forEach((docs) => {
      docs.filter((d) => d.status === 'pending').forEach((d) => allPending.push(d));
    });
    return allPending;
  }

  async updateReviewStatus(
    docId: number,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ) {
    let found = false;
    let targetDoc: any = null;

    this.documentQueue.forEach((docs) => {
      const doc = docs.find((d) => d.id === docId);
      if (doc) {
        doc.status = status;
        doc.reviewed_at = new Date();
        if (rejectionReason) doc.rejection_reason = rejectionReason;
        found = true;
        targetDoc = doc;
      }
    });

    if (!found) throw new BadRequestException('Document not found in review queue.');
    return { success: true, document: targetDoc };
  }
}
