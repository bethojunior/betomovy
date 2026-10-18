import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    // Conexão rápida com baixa latência
  }

  handleDisconnect(client: Socket) {
    // Desconexão limpa
  }

  // 1. Atualização Contínua de GPS com Ângulo de Rotação (Smooth Bearing 60 FPS)
  @SubscribeMessage('driver:update_location')
  handleLocationUpdate(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { driver_id: number; lat: number; lng: number; bearing: number }
  ) {
    // Broadcast eficiente para a sala da cidade ou do passageiro acompanhando
    this.server.emit(`driver:location:${data.driver_id}`, {
      driver_id: data.driver_id,
      lat: data.lat,
      lng: data.lng,
      bearing: data.bearing, // Ângulo para a curva suave da frente do carro
      timestamp: Date.now(),
    });
  }

  // 2. Transmissão do MOVY Negocia em Tempo Real
  @SubscribeMessage('negocia:new_counter_offer')
  handleNegociaOffer(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { trip_id: string; driver_id: number; amount: number; currency: string }
  ) {
    this.server.emit(`trip:negocia:${data.trip_id}`, {
      event: 'counter_offer_received',
      driver_id: data.driver_id,
      amount: data.amount,
      currency: data.currency,
      timestamp: Date.now(),
    });
  }

  // 3. Notificação Instantânea de Saque Realizado (Zelle / Pix)
  broadcastCashoutSuccess(driverId: number, amount: number, method: string) {
    this.server.emit(`driver:cashout:${driverId}`, {
      status: 'completed',
      amount,
      method,
      message: method === 'zelle' ? `Zelle transfer completed!` : `Pix transferido com sucesso!`,
    });
  }
}
