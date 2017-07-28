import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { flyIn } from "../../../animations/fly-In";
import { BasicInfoService } from "./basic-info.service";
import { Http } from "@angular/http"
import { SelectOption, SelectOptionGroup, updateBasicInfo } from './basic-info.model';

@Component({
    selector: 'basic',
    templateUrl: './basic-info.component.html',
    styleUrls: ['./basic-info.component.scss'],
    animations: [flyIn]
})
export class BasicInfoComponent implements OnInit {
    public isShowBG: boolean = true;    // 是否显示头像圆框
    public headUrl: string;             // 初始头像url
    public years = [];
    public days = [];
    public birYear;
    public birMonth;
    public birDay;
    public storeLetterList: Array<any>; //门店标识列表
    public storeList: Array<any>;       //门店列表
    public storeLetter: any;            //选中的门店标识
    public store: any;                  //选中的门店
    public provList: Array<any>;
    public cityList: Array<any>;
    public areaList: Array<any>;
    public prov: string;
    public city: string;
    public area: string;
    public basicParams: updateBasicInfo = new updateBasicInfo();

    constructor(
        public _BasicService: BasicInfoService,
        public _http: Http,
        public _Router: Router
    ) { }

    ngOnInit() {
        this.getBasicInfo();
        this.loadStore();
        this.loadYears();
        this.loadLocation();
    }
    // 获取基础信息
    private getBasicInfo() {
        var data = JSON.parse(localStorage.getItem('IDENTITY'));
        this.headUrl = data.headUrl;                            // 头像 headUrl     
        this.basicParams.nickName = data.nickName;              // 昵称 nickName        
        this.birYear = data.birthday.split('-')[0];             // 出生日期 birthday
        this.birMonth = parseInt(data.birthday.split('-')[1]);
        this.birDay = parseInt(data.birthday.split('-')[2]);
        this.basicParams.storeName = data.storeName;            // 门店名称 storeName
        this.basicParams.provId = data.provId;                  // 地区 location
        this.basicParams.cityId = data.cityId;
        this.basicParams.districtId = data.districtId;
    }

    // 修改头像
    private chooseImg() {
        var imgdata = new FormData($('#updateImg')[0]);
        this._BasicService.updateHeadImg(this.headUrl, imgdata).then(res => {
            // console.log(res);
            this.basicParams.headUrl = res.result.fileUrl;
        }).catch(err => {
            console.log(err);
        })
    }
    private imgSave() {
        if (this.basicParams.headUrl != null) {
            this.headUrl = this.basicParams.headUrl;
        }
    }

    // 设置出生日期的年月日选择项
    private loadYears() {
        for (var i = 1, date = new Date().getFullYear(); i <= 100; i++) {
            this.years.push(date--);
        }
        this.loadMonths('def');
    }
    private loadMonths(flag) {
        flag != 'def' && (this.birMonth = 1);
        this.loadDays(flag);
    }
    private loadDays(flag) {
        this.days = [];
        flag != 'def' && (this.birDay = 1);
        let temp = 31;
        if (this.birMonth == 4 || this.birMonth == 6 || this.birMonth == 9 || this.birMonth == 11) {
            temp = 30;
        } else if (this.birMonth == 2) {
            temp = (this.birYear % 4 == 0 && this.birYear % 100 != 0) || this.birYear % 400 == 0 ? 28 : 29;
        }
        for (let i = 1; i <= temp; i++) {
            this.days.push(i);
        }
    }

    // 获取品牌 && 选择门店
    private loadStore() {
        this._BasicService.getStoreList().then(res => {
            // console.log(res);
            this.storeLetterList = (Object.keys(res.result).map(key => new SelectOptionGroup(key, res.result[key])));
            this.storeLetter = this.storeLetterList[0].label;
            this.storeList = this.storeLetterList[0].options;
        }).catch(err => {
            console.log(err);
        })
    }
    private selectStoreLetter(opt: any) {
        this.storeLetter = opt.label;
        for (let item of this.storeLetterList) {
            if (item.label == opt.label) {
                this.storeList = item.options;
                break;
            }
        }
    }
    private selectStore(opt: any) {
        this.basicParams.storeName = opt.text;
        this.store = opt.value;
    }

    // 设置所在地区的省市区选择项
    private loadLocation() {
        this._BasicService.getLocation().then(res => {
            // console.log(res.result.data);
            this.provList = res.result.data;
            this.loadCitys('def');
        }).catch(err => {
            console.log(err);
        })
    }
    private loadCitys(temp) {
        this.cityList = this.areaList = null;
        for (let item of this.provList) {
            if (item[0] == this.basicParams.provId) {
                this.cityList = item[3];
                temp != 'def' && (this.basicParams.cityId = item[3][0][0]);
                this.loadAreas(temp);
                break;
            }
        }
    }
    private loadAreas(temp) {
        this.areaList = null;
        for (let item of this.cityList) {
            if (item[0] == this.basicParams.cityId) {
                this.areaList = item[3];
                temp != 'def' && (this.basicParams.districtId = item[3][0][0]);
                break;
            }
        }
    }

    // 重置密码
    private location() {
        this._Router.navigate(['/modifypwd']);
    }

    // 基础信息保存
    private basicInfoSave() {
        let areas = [];
        $('.area option:selected').each((index, elem) => areas.push($(elem).text()));
        this.basicParams.areaName = areas.filter(m => !!m).join('-');
        this.basicParams.birthday = this.birYear + '-' + this.birMonth + '-' + this.birDay;
        this.basicParams.headUrl = this.basicParams.headUrl == '' ? this.headUrl : this.basicParams.headUrl;
        // console.log(this.basicParams);
        this._BasicService.updateInfo(this.basicParams).then(res => {
            // console.log(res);
            var data = JSON.parse(localStorage.getItem('IDENTITY'));
            data.headUrl = this.basicParams.headUrl;
            data.nickName = this.basicParams.nickName;
            data.birthday = this.basicParams.birthday;
            data.storeName = this.basicParams.storeName;
            data.areaName = this.basicParams.areaName;
            data.provId = this.basicParams.provId;
            data.cityId = this.basicParams.cityId;
            data.districtId = this.basicParams.districtId;
            localStorage.setItem('IDENTITY', JSON.stringify(data));
            this._Router.navigate(['/home']);
            // this.getBasicInfo();
        }).catch(err => {
            console.log(err);
        })
    }
    //
    private infoReset() {
        this._Router.navigate(['/home']);
        // this.getBasicInfo();
        // this.loadCitys('def');
        // this.storeLetter = this.storeLetterList[0].label;
        // this.storeList = this.storeLetterList[0].options;
        // this.store = '';

    }
}