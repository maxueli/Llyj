import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../app.service'

@Injectable()
export class LoginService {
    constructor(
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public _login(Params) {
        let self = this;
        const url = this._AppService._ngUrl.concat('member/login');
        // let basic = btoa(`${Params.userName}:${Params.password}`);
        // console.log(basic);
        let headers = new Headers({ 'projectName':'bc','clientType':'web','osVesion':'10.3','deviceId':'1' });
        let formdata = new FormData();
        formdata.append('username',Params.userName);
        formdata.append('password',Params.password);
        return this._http.post(url, formdata,{ headers: headers })
            .toPromise()
            .then(resp => self.extractData(resp))
            .catch(err => self.handleError(err));
    }
    public extractData(res) {
        // console.log(res);
        let text = res.text();
        if (!text) return;
        let data = res.json();
        if (!data) return;
        let result = data;
        if (!result) {
            throw new TypeError('返回对象类型转换失败！');
        }
        return result;
    }
    public handleError(error: any) {
        let res = JSON.parse(error._body);
        // console.log(error);
        return Promise.reject(error.message || error);
    }
    // // 查看是不是专家
    // public isExpert() {
    //     const url = this._AppService._url.concat('diag/members/getmemberinfo');
    //     return this._AppService._get(url);
    // }
    // // 登录更新在线状态
    // public updateStatu(statu){
    //     const url = this._AppService._url.concat('/diag/members/updateonlinestatu/'+statu);
    //     return this._AppService._post(url,{});
    // }

}