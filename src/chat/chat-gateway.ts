import { MessageBody, OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import {Socket,Server} from "socket.io";
@WebSocketGateway(3002,{cors :{origin: "*"}})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect{
    handleConnection(client: Socket) {
        console.log( "Hrthe o pelaths" + " " + client.id);

        this.server.emit("user-joinned",`New user connected ${client.id}`)
    }
    handleDisconnect(client: Socket) {
        console.log( "Efyge o pelaths" + " " + client.id);
        this.server.emit("user-disjoinned",`User ${client.id} disconnected `)
    }

    @WebSocketServer() 
    server: Server;

    @SubscribeMessage('newmessage')
    handleNewMessage(client: Socket,message: any){
        console.log(message + " hrthe");

        client.emit('reply','Giayto sou apantaw pisw');

        this.server.emit("reply", " broadcast message");
    }

}