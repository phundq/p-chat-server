import { Server, Socket } from 'socket.io';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Messenger } from './message.i';

@WebSocketGateway()
export class ChatGetway {
     @WebSocketServer()
  server: Server;
  @SubscribeMessage('chatToServer')
  handChat(client : Socket ,payload :Messenger){
    console.log(payload);
    try { 
			this.server.in(payload.room).clients((error, clients) => {
				if (error) throw error;
				console.log(clients); 
			});
		} catch(err) {
			console.log(err);
		}
    this.server.to(payload.room).emit('chatToClient',payload);
  }

  @SubscribeMessage('joinRoom')
  joinRoom(client : Socket ,room :string){
    client.join(room);
  }
}