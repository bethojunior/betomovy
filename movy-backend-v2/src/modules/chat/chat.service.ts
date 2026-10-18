import { Injectable, BadRequestException } from '@nestjs/common';

export interface ChatMessageDto {
  trip_id: string;
  sender_user_id: number;
  sender_name: string;
  sender_role: 'passenger' | 'driver';
  message_type: 'text' | 'audio' | 'quick_reply';
  message_text?: string;
  audio_url?: string;
  audio_duration_seconds?: number;
}

@Injectable()
export class ChatService {
  private chatHistory = new Map<string, any[]>();

  async sendMessage(dto: ChatMessageDto) {
    if (!dto.message_text && !dto.audio_url) {
      throw new BadRequestException('Message must contain text or audio payload.');
    }

    const message = {
      id: 'msg_' + Date.now().toString(36),
      trip_id: dto.trip_id,
      sender_user_id: dto.sender_user_id,
      sender_name: dto.sender_name,
      sender_role: dto.sender_role,
      message_type: dto.message_type,
      message_text: dto.message_text || null,
      audio_url: dto.audio_url || null,
      audio_duration_seconds: dto.audio_duration_seconds || 0,
      timestamp: new Date(),
    };

    const history = this.chatHistory.get(dto.trip_id) || [];
    history.push(message);
    this.chatHistory.set(dto.trip_id, history);

    return {
      success: true,
      message,
    };
  }

  async getMessages(tripId: string) {
    return this.chatHistory.get(tripId) || [];
  }
}
