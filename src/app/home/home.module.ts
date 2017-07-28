import { NgModule, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { HomeService } from './home.service'
import { VideosService } from './videos/videos.service'
import {ChatService} from './socket.service'

import { HomeComponent } from './home.component'
import { routing, routedComponents } from './home.routings'

import { SocketIoModule, SocketIoConfig } from 'ng2-socket-io';
import { ProgressbarModule } from 'ngx-bootstrap'
let url: string = "ws://42.159.202.20:8887";
const query = { 'clientid': localStorage.getItem('phone')?localStorage.getItem('phone'):'', "Authorization":"Bearer "+localStorage.getItem('token')}
const config: SocketIoConfig = {
    url: url,
    options: { transports: ['websocket'], reconnectionDelay: 1e3, reconnectionDelayMax: 3e3, timeout: 5e3, query:query }
};
@NgModule({
    declarations: [
        routedComponents,

    ],
    imports: [
        FormsModule,
        HttpModule,
        routing,
        CommonModule,
        ModalModule.forRoot(),
        PaginationModule.forRoot(),
        SocketIoModule.forRoot(config),
        ProgressbarModule.forRoot(),
    ],
    exports: [],
    providers: [CookieService, HomeService, VideosService,ChatService],
})
export class HomeModule { }