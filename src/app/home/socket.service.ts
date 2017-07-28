import { Injectable } from '@angular/core';
import { Socket } from 'ng2-socket-io';

@Injectable()
export class ChatService {

    constructor(private socket: Socket) { }

    sendMessage(msg: string){
        this.socket.emit("message", msg);
    }

    getMessage() {
        return this.socket
            .fromEvent("message")
            .map( data => data);
    }
}