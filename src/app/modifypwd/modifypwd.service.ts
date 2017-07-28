import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../app.service'

@Injectable()
export class ModifypwdService {
    constructor(
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }
    private headers = new Headers({ 'Content-Type': 'application/json' });
    public getCode(mobile) {
        let url = "http://42.159.202.20:11111/message/code?mobile=" + mobile;
        let self = this;
        return this._http.post(url, {})
            .toPromise()
            .then(resp => self.extractData(resp))
            .catch(err => self.handleError(err));
    }
    public validCode(mobile, code) {
        let url = `http://42.159.202.20:11111/message/valid?mobile=${mobile}&validCode=${code}`;
        let self = this;
        return this._http.post(url, {})
            .toPromise()
            .then(resp => self.extractData(resp))
            .catch(err => self.handleError(err));
    }
    public setNewPwd(mobile, params) {
        let self = this;
        let url = `http://42.159.202.20:11111/user/updatepwd?mobile=${mobile}&newPassword=${params.newPassword}&validCode=${params.validCode}`;
        return this._http.put(url, {})
            .toPromise()
            .then(resp => self.extractData(resp))
            .catch(err => self.handleError(err));
    }
    public extractData(res) {
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
        return Promise.reject(error.message || error);
    }
}