import { WsGuard } from './ws.guard';
import { UseGuards } from '@nestjs/common';
import { GatewayMetadata, MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { JwtServiceCustom } from './../auth/jwt.service.custom';
import { User } from './../user/user.model.i';
import { Messenger } from './message.i';

export interface GatewayMetadataExtended extends GatewayMetadata {
  handlePreflightRequest: (req, res) => void;
}

const options = {
  handlePreflightRequest: (req, res) => {
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-token',
      'Access-Control-Allow-Origin': req.headers.origin,
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Max-Age': '1728000',
      'Content-Length': '0',
    };
    res.writeHead(200, headers);
    res.end();
  },
} as GatewayMetadataExtended;

@WebSocketGateway(options)
export class ChatGateway {
  @WebSocketServer() server: Server;
  connectedUsers: string[] = [];

  constructor(
  ) { }

  @UseGuards(WsGuard)
  @SubscribeMessage('chatToServer')
  handChat(@MessageBody() payload: Messenger) {
    console.log(payload);
    try {
      this.server.in(payload.room).clients((error, clients) => {
        if (error) throw error;
        console.log(clients);
      });
    } catch (err) {
      console.log(err);
    }
    this.server.to(payload.room).emit('chatToClient', payload);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage('joinRoom')
  joinRoom(client: Socket, room: string) {
    client.join(room);
  }
}