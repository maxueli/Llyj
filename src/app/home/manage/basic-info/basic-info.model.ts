export class SelectOption {
    constructor(
        public text?: string,
        public value?: string,
        public selected?: boolean
    ) {
    }
}
export class SelectOptionGroup {
    public label: string;
    public options: Array<SelectOption>;
    constructor(label: string, options: Array<SelectOption>) {
        this.label = label;
        this.options = options;
    }
}
// 专家基本信息
export class updateBasicInfo {
    nickName: string;       //昵称
    birthday: string;       //出生日期
    storeName: string;      //门店名称 
    headUrl: string = '';   //头像地址   
    areaName: string;       //地区
    provId : number;        //省市区Id
    cityId  : number;
    districtId  : number;
}
// 专家登录密码
export class basicPassword{
    newPwd: string;
    resetPwd: string;
}