// 这里定义类

export class User {
    userName: string;
    password: string;
    token: string;
}
export class expertInfo {
    headUrl: string = '';//头像
    realName: string;//姓名
    mobile: string;//手机
    starRating: string;//星星
    seekHelpNum: string;//求助次数
    answerNum: string;//接听次数
}
// 专家接听拒接
export class reply {
    callId:string;//电话的id
    callStatus: string;//状态码，1是接听，2是挂断
}
// 邀请专家是获取专家列表
export class findexpertList {
    carBrandId: number;//车辆品牌
    faults: Array<any>;//故障问题集合
}