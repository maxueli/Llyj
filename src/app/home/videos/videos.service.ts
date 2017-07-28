import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../../app.service'

@Injectable()

export class VideosService {
    public _url = 'http://42.159.144.219:8383/image';
    constructor(
        
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }
    // 获取来电的信息
    public getcallinfo(roomId){
        let url = this._AppService._ngUrl.concat(`getcallinfo/${roomId}`);
        return this._AppService._post(url,{});
    }
    //邀请专家获得专家列表
    public findexpertlist(Params){
        let url = this._AppService._ngUrl.concat('findexpertlist');
        return this._AppService.videoFormData(url,Params);
    }
    public closePhone(Params){
        let url = this._AppService._ngUrl.concat('exitcall');
        return this._AppService._post(url,Params);
    }
    // 上传文件，返回url
    public upFiles(Params){
        let url = this._AppService._upFile.concat('file');
        return this._AppService.formData(url,Params);
    }
    // 视频中上传文件
    public videopostFile(Params){
        let url = this._AppService._ngUrl.concat('callfile');
        return this._AppService._post(url,Params);
    }
    public videogetFile(id){
        let url = this._AppService._ngUrl.concat('callfile?callId='+id);
        return this._AppService._get(url);
    }
    // 直通专家
    public straighExperts(Params){
        let url = this._AppService._ngUrl.concat('straightexperts');
        return this._AppService.videoFormData(url,Params);
    }
    // 挂断电话
    public exitcall(Params){
        let url = this._AppService._ngUrl.concat('exitcall');
        return this._AppService.videoFormData(url,Params);
    }
    
}