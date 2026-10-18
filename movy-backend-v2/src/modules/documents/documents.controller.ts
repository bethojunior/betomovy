import { Controller, Post, Get, Put, Body, Param } from '@nestjs/common';
import { DocumentsService, DriverDocumentSubmissionDto } from './documents.service';

@Controller('documents')
export class DocumentsController {
  constructor(private readonly documentsService: DocumentsService) {}

  @Post('upload')
  async submitDocument(@Body() dto: DriverDocumentSubmissionDto) {
    return this.documentsService.submitDocument(dto);
  }

  @Get('driver/:driverId')
  async getDriverDocuments(@Param('driverId') driverId: string) {
    return this.documentsService.getDriverDocuments(Number(driverId));
  }

  @Get('review-queue')
  async getPendingReviewQueue() {
    return this.documentsService.getPendingReviewQueue();
  }

  @Put('review/:docId')
  async updateReviewStatus(
    @Param('docId') docId: string,
    @Body() body: { status: 'approved' | 'rejected'; rejection_reason?: string }
  ) {
    return this.documentsService.updateReviewStatus(
      Number(docId),
      body.status,
      body.rejection_reason
    );
  }
}
