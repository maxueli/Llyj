import { Component, OnInit } from '@angular/core';
import { flyIn } from '../../../animations/fly-In';
import { authenticationInfo } from './authentication-info.model';

@Component({
    selector: 'authentication',
    templateUrl: './authentication-info.component.html',
    styleUrls: ['./authentication-info.component.scss'],
    animations: [
        flyIn
    ]
})
export class AuthenticationInfoComponent implements OnInit {

    public authData: authenticationInfo = new authenticationInfo();

    ngOnInit() {
        var data = JSON.parse(localStorage.getItem('IDENTITY'));
        this.authData.name = data.realName;
        this.authData.workYear = data.otherInfo.workYears;
        this.authData.authImg = data.otherInfo.credentials;
    }
}
