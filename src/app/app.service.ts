import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions, ResponseContentType, RequestMethod } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { Router } from '@angular/router';
import * as filesave from 'file-saver';
@Injectable()
export class AppService {
    // public _url = "http://api.blue-collar.sinoauto.com/";
    // public _wsUrl = 'ws://42.159.144.219:5555/';
    public _ngUrl = 'http://42.159.202.20:55555/';
    public _upFile = 'http://42.159.202.20:22222/';

    public headers = new Headers();
    // public formdataHeader = new Headers({ 'Content-Type': 'multipart/form-data' })
    public readonly _sessionName = 'IDENTITY';
    constructor(
        private _http: Http,
        private _router: Router
    ) { }
    public _get(url) {
        this.setHeadersToken();
        return this._http.get(url, { headers: this.headers })
            .toPromise()
            .then(response => this.extractData(response))
            .catch(err => this.handleError(err));
    }
    //post方法
    public _post(url: string, body) {
        this.setHeadersToken();
        return this._http
            .post(url, body, { headers: this.headers })
            .toPromise()
            .then(response => this.extractData(response))
            .catch(err => this.handleError(err));
    }
    //更新数据
    public _update(url, params) {
        this.setHeadersToken();
        // const _url = `${url}/${params.id}`;
        return this._http
            .put(url, params, { headers: this.headers })
            .toPromise()
            .then(response => this.extractData(response))
            .catch(err => this.handleError(err));
    }
    //更新数据
    public _put(url, param) {
        this.setHeadersToken();
        return this._http
            .put(url, param, { headers: this.headers })
            .toPromise()
            .then(response => this.extractData(response))
            .catch(err => this.handleError(err));
    }
    //删除方法
    public _delete(url, id: number, ): Promise<void> {
        this.setHeadersToken();
        const _url = `url/${id}`;
        return this._http
            .delete(_url, { headers: this.headers })
            .toPromise()
            .then(resp => Promise.resolve())
            .catch(this.handleError);
    }
    // 上传
    public _patch(url: string, params: any, ) {
        this.setHeadersToken();
        return this._http.patch(url, params, { headers: this.headers })
            .toPromise()
            .then(response => this.extractData(response))
            .catch(this.handleError);
    }
    public download(url: string, fileName?: string): void {
        this.setHeadersToken();
        this._http.get(url, { responseType: ResponseContentType.Blob, headers: this.headers }).toPromise().then(res => {
            let data = res.blob();
            filesave.saveAs(data, fileName);
        }).catch(error => {
            console.log(error);
        })

    }
    //视频接听
    public videoFormData(url, params) {
        let formsd = new FormData();
        params.map(value=>{
            formsd.append(value.key,value.value)
        })
        // console.log(form);
        this.setHeadersToken();
        return this._http.post(url, formsd, { headers: this.headers })
            .toPromise()
            .then(res => this.extractData(res))
            .catch(err => this.handleError(err))
    }
    //formData上传文件、图片。
    //调用formData(url地址，Dom对象（form）)
    public formData(url: string, el) {
        let file = new FormData(el);
        this.setHeadersToken();
        return this._http.post(url, file)
            .toPromise()
            .then(res => this.extractData(res))
            .catch(err => this.handleError(err));
    }
    //清除
    public clearStorage() {
        localStorage.removeItem(this._sessionName);
    }
    //保存localstorage
    public saveStorage(params: Object) {
        if (params) {
            let json: string = JSON.stringify(params);
            localStorage.setItem(this._sessionName, json);
        } else {
            alert("token没有传入进来");
        }
    }
    // 设置token
    public setHeadersToken() {
        if (localStorage[this._sessionName]) {
            let token = JSON.parse(localStorage[this._sessionName]);
            this.headers.delete('Authorization');
            //读取的时候token会进来
            this.headers.append('Authorization', "Bearer " + token['token']);
            // this.headers.append('registration','web');
        } else {
            alert("登陆时间失效");
            this._router.navigate(['/login']);
        }
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
        console.log(res);
        // if(res.errcode=='40004'){
        //     alert('用户在其他电脑登录，请重新登录');
        //     this._router.navigate(['/login']);
        // }
        return Promise.reject(error.message || error);
    }
}