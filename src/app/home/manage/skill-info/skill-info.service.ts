import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../../../app.service'

@Injectable()
export class SkillInfoService {
    constructor(
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }

    // 加载品牌信息
    public getBrandList() {
        return this._AppService._get(this._AppService._ngUrl.concat('findallbrand'))
            .catch(err => Promise.reject('品牌加载失败:'.concat(err)))
    }
    // 加载技能信息
    public getSkillList() {
        return this._AppService._get(this._AppService._ngUrl.concat('findallfault'))
            .catch(err => Promise.reject('技能加载失败:'.concat(err)))
    }
    //  保存专家技能信息
    public saveBrandSkill(params) {
        return this._AppService._post(this._AppService._ngUrl.concat('expertinfo'), params)
            .catch(err => { Promise.reject('专家信息修改失败：'.concat(err)); })
    }
}