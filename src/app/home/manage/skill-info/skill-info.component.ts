import { Component, ViewChild, OnInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { flyIn } from '../../../animations/fly-In';
import { SkillInfoService } from './skill-info.service';
import { SelectOption, SelectOptionGroup, brandInfo, carBrand, carSkill } from './skill-info.model';

@Component({
    selector: 'skill',
    templateUrl: './skill-info.component.html',
    styleUrls: ['./skill-info.component.scss'],
    animations: [flyIn]
})
export class SkillInfoComponent implements OnInit {
    @ViewChild('updateBrand') public updateBrand: ModalDirective;
    @ViewChild('updateSkill') public updateSkill: ModalDirective;

    public params: brandInfo = new brandInfo();     // 所有修改过的品牌技能信息
    public brandLetterList: Array<any>;             // 品牌列表
    public skillLetterList: Array<any>;             // 技能列表
    public brandList: carBrand = new carBrand();    // 单次添加的品牌技能信息
    public skillList = [];                          // 选择的技能列表
    public brandId: number = null;                  // 标识是修改还是添加
    public isComfirm: boolean;               // 是否修改了技能信息
    public isSubmit: boolean = true;                // 是否显示提交按钮

    constructor(
        private _skillInfoService: SkillInfoService
    ) {

    }
    ngOnInit() {
        this.params.carBrands = JSON.parse(localStorage.getItem('IDENTITY')).otherInfo.carBrands.slice(0);
        this.loadBrand();
        this.loadSkill();
    }

    // 加载品牌列表和技能列表
    private loadBrand() {
        this._skillInfoService.getBrandList().then(res => {
            this.brandLetterList = (Object.keys(res.result).map(key => new SelectOptionGroup(key, res.result[key].map(item => new SelectOption(item.text, item.value, false)))));
            // console.log(this.brandLetterList);
            for (let item of this.params.carBrands) {
                for (let letter of this.brandLetterList) {
                    for (let letterItem of letter.options) {
                        if (item.carBrandName == letterItem.text) {
                            letterItem.selected = true;
                        }
                    }
                }
            }
        }).catch(err => {
            console.log(err);
        })
    }
    private loadSkill() {
        this._skillInfoService.getSkillList().then(res => {
            this.skillLetterList = (Object.keys(res.result).map(key => new SelectOption(res.result[key].text, res.result[key].value, false)));
            // console.log(this.skillLetterList);
        }).catch(err => {
            console.log(err);
        })
    }
    // 选择品牌和技能
    private selectBrand(opt) {
        opt.selected = !opt.selected;
        this.updateBrand.hide();
        this.updateSkill.show();
        this.brandList = new carBrand();
        this.brandList.carBrandId = opt.value;
        this.brandList.carBrandName = opt.text;
        this.brandList.faults = [];
        this.isComfirm = true;
    }
    private selectSkill(opt) {
        opt.selected = !opt.selected;
        if (opt.selected == true) {
            this.skillList.push(opt);
        } else {
            for (let i = 0; i < this.skillList.length; i++) {
                if (this.skillList[i].text == opt.text && this.skillList[i].value == opt.value) {
                    this.delArr(this.skillList, i);
                    break;
                }
            }
        }
        this.skillList.length == 0 ? this.isComfirm = true : this.isComfirm = false;
    }
    // 技能选择确认和取消
    private confirmSkill() {
        if (this.brandId == null) {
            for (let item of this.skillList) {
                let temp = new carSkill();
                temp.text = item.text;
                temp.value = item.value;
                this.brandList.faults.push(temp);
            }
            this.params.carBrands.push(this.brandList);
        } else {
            this.params.carBrands[this.brandId].faults = [];
            for (let item of this.skillList) {
                let temp = new carSkill();
                temp.text = item.text;
                temp.value = item.value;
                this.params.carBrands[this.brandId].faults.push(temp);
            }
        }
        this.isSubmit = this.isComfirm = false;
        this.cancelSkill();
    }
    private cancelSkill(temp?: string) {
        this.updateSkill.hide();
        this.skillList = [];
        this.brandId = null;
        for (let item of this.skillLetterList) {
            item.selected = false;
        }
    }

    // 获取修改或删除的品牌技能信息ID
    private defauleSkill(id) {
        this.updateSkill.show();
        this.brandId = id;
        for (let pItem of this.params.carBrands[id].faults) {
            this.skillList.push(pItem);
            for (let sItem of this.skillLetterList) {
                if (pItem.value == sItem.value) {
                    sItem.selected = true;
                }
            }
        }
    }
    private deleteSkill(id) {
        this.isSubmit = false;
        this.delArr(this.params.carBrands, id);
    }

    // 更新技能信息
    private saveInfo() {
        console.log(this.params);
        console.log(this.brandList);
        this._skillInfoService.saveBrandSkill(this.params).then(res => {
            console.log(res);
            if (res.errmsg == 'success') {
                this.isSubmit = true;
                let data = JSON.parse(localStorage.getItem('IDENTITY'));
                data.otherInfo.carBrands = this.params.carBrands;
                localStorage.setItem('IDENTITY', JSON.stringify(data));
            }
        }).catch(err => {
            console.log(err);
        })
    }

    // 删除技能或品牌数组中指定位置的内容
    private delArr(arr, id) {
        let i = id;
        for (; i < arr.length - 1; i++) {
            arr[i] = arr[i + 1];
        }
        (i == arr.length - 1) && arr.length--;
    }
}