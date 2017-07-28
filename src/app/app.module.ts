import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule, JsonpModule, Http } from '@angular/http';
import { routing, routedComponents } from './app.routings';
import { ModalModule } from 'ngx-bootstrap';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component'
import { ModifypwdComponent } from './modifypwd/modifypwd.component'
import { HomeComponent } from './home/home.component';
import { User } from './app.model'
import { AppService } from './app.service'


import { LoginService } from './login/login.service';
import { ModifypwdService } from './modifypwd/modifypwd.service';


const APP_PROVIDERS = [
    LoginService,
    ModifypwdService
]
const APP_ENITY = [
    User
]
@NgModule({
    declarations: [
        AppComponent,
        routedComponents
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        routing,
        ModalModule.forRoot(),

    ],
    providers: [AppService, APP_PROVIDERS, APP_ENITY],
    bootstrap: [AppComponent],

})
export class AppModule { }
