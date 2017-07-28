import { Params, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/toPromise';
import { AppService } from '../../app.service'

@Injectable()

export class manageService {
    public _url = 'http://42.159.144.219:8383/image';
    constructor(
        public _http: Http,
        public _router: Router,
        public _AppService: AppService
    ) { }
    
    
}