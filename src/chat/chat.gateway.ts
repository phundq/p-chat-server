import { UseGuards } from '@nestjs/common';
import { GatewayMetadata, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { JwtServiceCustom } from './../auth/jwt.service.custom';
import { SocketConstants } from './../common/constant/socket.constants';
import { SocketService } from './../socket/socket.service';
import { UserService } from './../user/user.service';
import { Messenger } from './message.i';
import { WsGuard } from './ws.guard';

export interface SocketConnection {
  userId: number;
  client: Socket;
}

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
  connectedList: SocketConnection[] = [];

  constructor(
    private socketService: SocketService,
    private jwtService: JwtServiceCustom,
    private userService: UserService,
  ) { }

  afterInit() {
    this.socketService.server = this.server;
  }

  handleConnection(client: Socket, ...args: any[]) {
    const bearerToken = client.handshake.headers.authorization.split(' ')[1];

    this.jwtService.verify(bearerToken).then(decoded => {
      this.userService.findByUsername(decoded.username).then(
        _user => {
          this.saveConnection(_user.id, client);
        }
      ).catch(
        err => {
          console.log("false 1");
          this.socketService.emitError(client)
        }
      )
    })
      .catch(err => {
        console.log("false 2");
        this.socketService.emitError(client)
      })

    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    this.removeConnection(client);
  }

  saveConnection(userId: number, client: Socket) {
    const connect: SocketConnection = {
      userId: userId,
      client: client
    }

    this.connectedList.push(connect);
  }

  removeConnection(client: Socket) {
    this.connectedList.forEach((value, index) => {
      if (value.client.id === client.id) {
        this.connectedList.splice(index, 1);
      }
    })
  }

  @UseGuards(WsGuard)
  @SubscribeMessage(SocketConstants.CHAT_TO_SERVER)
  handChat(@MessageBody() payload: Messenger) {
    console.log(payload);
    try {
      this.server.in(payload.room).clients((error, clients) => {
        if (error) throw error;
      });
    } catch (err) {
      console.log(err);
    }
    this.connectedList.forEach((value, index) => {
      if (value.userId === payload.receiveId || value.userId == payload.senderId) {
        this.server.to(value.client.id).emit(SocketConstants.CHAT_TO_CLIENT, payload);
      }
    })

  }

  // @UseGuards(WsGuard)
  @SubscribeMessage(SocketConstants.JOIN_ROOM)
  joinRoom(client: Socket, room: string) {
    console.log("join");
    client.join(room);
  }
}