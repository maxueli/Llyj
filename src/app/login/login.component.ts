import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { flyIn } from '../animations/fly-in'
import { User } from '../app.model'
import { LoginService } from './login.service';
import { AppService } from '../app.service'
import { ModalDirective } from 'ngx-bootstrap/modal';

import { ModalModule } from 'ngx-bootstrap/modal';
@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('massageModal') public massageModal: ModalDirective;

  public message: string = '';
  public _user = new User();
  public data: any;
  constructor(
    public _Routes: Router,
    public _LoginService: LoginService,
    public _AppService: AppService

  ) { }
  ngOnInit() {
    // console.log(this._user);
  }
  login() {
    let self = this;
    this._LoginService._login(self._user).then(res => {
    //   console.log(res);
      if (res.errcode == 0) {
        // console.log(res.result);
        localStorage.clear();
        this._AppService.saveStorage(res.result);
        this.data = res.result;
        self._user.token = this.data.token;
        localStorage.setItem('phone', self._user.userName);
        localStorage.setItem('token',self._user.token);
        this._Routes.navigate(['/home']);
      }
    }).catch(err => {
      this.message = JSON.parse(err._body).errmsg;
      this.massageModal.show();
    })
  }
}
