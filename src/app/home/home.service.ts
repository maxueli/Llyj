import { Params, Router } from '@angular/router';
import { Injectable,EventEmitter } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../app.service'

@Injectable()

export class HomeService {
    public _url = 'http://42.159.144.219:8383/image';
    public obj :EventEmitter<object>;
    constructor(
        
        public _http: Http,
        public _router: Router,
        public _AppService: AppService,
        
    ) { 
        this.obj = new EventEmitter();
    }
    public getImgUrl(obj) {
        let file = new FormData(obj);
        return this._AppService._post(this._url, file)
            .catch(err => Promise.reject('加载失败:'.concat(err)))
    }
    // 获取接听、求助次数，星星
    public getExpertdata(){
        let url = this._AppService._ngUrl.concat('expertdata');
        return this._AppService._post(url,{})
    }
    // 接听或挂断
    public rePly(Params){
        let url = this._AppService._ngUrl.concat('reply');
        return this._AppService.videoFormData(url,Params);
    }
    // 意见反馈
    public feedbacks(Params){
        let url = this._AppService._ngUrl.concat('feedbacks');
        return this._AppService._post(url,Params);
    }
    // 退出
    public loginout(){
        let url = this._AppService._ngUrl.concat('loginout');
        return this._AppService._post(url,{});
    }
    
}