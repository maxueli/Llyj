import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../../../app.service'

@Injectable()
export class BasicInfoService {
    constructor(
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }

    // 加载门店信息
    public getStoreList() {
        return this._AppService._post(this._AppService._ngUrl.concat('findstoresbyfirstchar'), '')
            .catch(err => Promise.reject('品牌加载失败:'.concat(err)))
    }
    // 加载地区信息
    public getLocation() {
        let url = "http://42.159.202.20:9999/location";
        return this._AppService._get(url)
            .catch(err => { Promise.reject('地区加载失败：'.concat(err)); })
    }
    // 上传修改头像
    public updateHeadImg(imgurl, param: FormData) {
        console.log(param);
        let url = "http://42.159.202.20:22222/image?url=" + imgurl;
        return this._AppService._put(url, param)
            .catch(err => { Promise.reject('上传图片失败：'.concat(err)); })
    }
    // 保存专家基本信息
    public updateInfo(param) {
        return this._AppService._post(this._AppService._ngUrl.concat('expertinfo'), param)
            .catch(err => { Promise.reject('专家信息修改失败：'.concat(err)); })
    }
}