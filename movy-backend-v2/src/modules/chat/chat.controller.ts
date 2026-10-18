import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { ChatService, ChatMessageDto } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  async sendMessage(@Body() dto: ChatMessageDto) {
    return this.chatService.sendMessage(dto);
  }

  @Get('history/:tripId')
  async getMessages(@Param('tripId') tripId: string) {
    return this.chatService.getMessages(tripId);
  }
}
