import { SocketConstants } from './../common/constant/socket.constants';
import { SocketService } from './../socket/socket.service';
import { WsGuard } from './ws.guard';
import { UseGuards, Injectable } from '@nestjs/common';
import { GatewayMetadata, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
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
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;
  connectedUsers: string[] = [];

  constructor(
    private socketService: SocketService
  ) { }

  afterInit() {
    this.socketService.server = this.server;
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketConstants.CHAT_TO_SERVER)
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
    this.server.to(payload.room).emit(SocketConstants.CHAT_TO_CLIENT, payload);
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketConstants.JOIN_ROOM)
  joinRoom(client: Socket, room: string) {
    console.log("join");
    client.join(room);
  }
}