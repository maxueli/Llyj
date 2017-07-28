import { Component, ViewChild, AfterViewChecked, DoCheck, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { user } from './modifypwd.model';
import { ModifypwdService } from './modifypwd.service';

@Component({
    selector: 'modifypwd',
    templateUrl: './modifypwd.component.html',
    styleUrls: ['./modifypwd.component.scss']
})
export class ModifypwdComponent implements AfterViewChecked, DoCheck, OnInit {
    public codeInfo = "获取验证码";
    public param: user = new user();
    public mobile: string = '';
    public againPassword: string = '';
    public active: boolean = true;
    public codeClick: boolean;
    public second: number = 59;
    public timer;

    codeform: NgForm;
    @ViewChild('codeform') currentForm: NgForm;
    constructor(
        public _ModifypwdService: ModifypwdService,
        public _Router: Router
    ) { }

    ngOnInit() {
        this.timer && clearInterval(this.timer);
    }
    ngDoCheck() {
        this.codeClick = this.mobile && !this.formErrors.mobile && this.codeInfo == '获取验证码' ? false : true;
        if (this.second == 0) {
            this.codeClick = false;
            this.codeInfo = '获取验证码';
            this.second = 59;
            clearInterval(this.timer);
        }
    }
    ngAfterViewChecked() {
        this.formChanged();
    }

    // 获取验证码
    private getMessageCode() {
        this._ModifypwdService.getCode(this.mobile).then(res => {
            console.log(res);
            if (res.result) {
                this.codeClick = true;
                this.codeInfo = '59 秒后可重发';
                this.timer = setInterval(() => {
                    this.codeInfo = --this.second + ' 秒后可重发';
                }, 1000);
            }
        }).catch(err => {
            alert(JSON.parse(err._body).errmsg);
        })
    }
    // 验证码校验
    private messageValid() {
        this.formChanged();
        this._ModifypwdService.validCode(this.mobile, this.param.validCode).then(res => {
            console.log(res);
            res.result && (this.active = false);
        }).catch(err => {
            console.log(err);
        })
    }
    // 提交验证码
    private resetPassword() {
        if (this.param.newPassword != this.againPassword) return;
        this._ModifypwdService.setNewPwd(this.mobile, this.param).then(res => {
            console.log(res);
            res.errmsg == 'success' && this._Router.navigate(['/login']);
        }).catch(err => {
            console.log(err);
        })
    }

    // 表单验证
    private formChanged() {
        if (this.currentForm === this.codeform) { return; }
        this.codeform = this.currentForm;
        if (this.codeform) {
            this.codeform.valueChanges.subscribe(data => this.onValueChanged(data));
        }
    }
    private onValueChanged(data?: any) {
        if (!this.codeform) { return; }
        const form = this.codeform.form;
        for (const field in this.formErrors) {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                for (const key in control.errors) {
                    this.formErrors[field] = messages[key] + ' ';
                }
            }
        }
    }
    public formErrors = {
        'mobile': '',
        'pwd': '',
        'newPass': '',
        'againPass': ''
    }
    public validationMessages = {
        'mobile': {
            'required': '* 请输入手机号',
            'pattern': '* 手机号码为11位数字',
            'minlength': '* 手机号码为11位数字',
            'maxlength': '* 手机号码为11位数字'
        },
        'pwd': {
            'required': '* 请输入验证码',
            'pattern': '* 验证码为6位数字',
            'minlength': '* 验证码为6位数字',
            'maxlength': '* 验证码为6位数字'
        },
        'newPass': {
            'required': '* 请输入新密码',
            'pattern': '* 密码包含大小写字母和数字',
            'minlength': '* 密码最少6位字符',
            'maxlength': '* 密码最多10位字符'
        },
        'againPass': {
            'required': '* 请再次输入新密码',
            'pattern': '* 密码包含大小写字母和数字',
            'minlength': '* 密码最少6位字符',
            'maxlength': '* 密码最多10位字符'
        }
    }
}
