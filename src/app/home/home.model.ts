export class PERMISSION {//(技师端／专家端发送 邀请接听的推送)
    SAccount: string = '';//发起询问或邀请的账号
    SName: string = '';// 发起询问或邀请的姓名
    RoomID?: string = '';// 会议的房间ID
    ChannelKey?: string;// 用于加入频道
    RecordingKey?: string;// 用于录制

}
// 意见反馈
export class Feedbacks {
    content: string = '';
    feedBackFilesDto:Array<feedBackFileList> = [];
}
export class feedBackFileList {
    fileName: string='';
    fileSize:number= 0;
    fileSubffix: string='';
    fileUrl: string='';
}