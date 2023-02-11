import { Inject } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Producer } from 'kafkajs';
import { Server } from 'socket.io';
import { Position } from './entities/position';

@WebSocketGateway({
  cors: true,
})
export class RoutesGateway {
  #kafkaProducer: Producer;

  @WebSocketServer()
  server: Server;

  constructor(
    @Inject('KAFKA_DELIVERY_APP')
    private kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.#kafkaProducer = await this.kafkaClient.connect();
  }

  @SubscribeMessage('new-direction')
  handleMessage(client: { id: string }, payload: { routeId: string }) {
    console.log(payload);
    this.#kafkaProducer.send({
      topic: 'route.new-direction',
      messages: [
        {
          key: 'route.new-direction',
          value: JSON.stringify({
            routeId: payload.routeId,
            clientId: client.id,
          }),
        },
      ],
    });
  }

  async sendPosition(data: Position) {
    const { clientId, ...rest } = data;
    const clients = this.server.sockets.sockets;
    if (!clients.has(clientId)) {
      console.error(
        'Client not exists, refresh app and resend new direction again',
      );
      return;
    }
    clients.get(clientId).emit('new-position', rest);
  }
}
