import { Component, ViewChild, } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { CookieService } from 'angular2-cookie/services/cookies.service';
import { Http } from "@angular/http"
import { HomeService } from './home.service'
import { AppService } from '../app.service'
import { Router } from '@angular/router';
import { Socket } from 'ng2-socket-io';

import { PERMISSION, Feedbacks, feedBackFileList } from './home.model'
import { reply, findexpertList } from '../app.model'


@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  public message: string = "";
  public _reply = new reply();
  public expertsSearchDto = new findexpertList();
  public data: any;
  public permission = new PERMISSION();
  public closeTime: number;
  public secs: number = 30;

  // 意见反馈
  public _Feedbacks = new Feedbacks();
  public _feedBackFileList = new feedBackFileList();

  // data =JSON.parse(localStorage.getItem('IDENTITY'));
  // public _expertInfo:expertInfo = new expertInfo();
  @ViewChild('childModal') public childModal: ModalDirective;
  @ViewChild('feedbackModal') public feedbackModal: ModalDirective;
  @ViewChild('replyModal') public replyModal: ModalDirective;
  @ViewChild('messageModal') public messageModal: ModalDirective;
  @ViewChild('staticModal') public staticModal: ModalDirective;
  constructor(
    private _socket: Socket,
    private _CookieService: CookieService,
    private _homeService: HomeService,
    private _http: Http,
    private _appService: AppService,
    private _router: Router
  ) { }

  // ws = new ReconnectingWebSocket(this.phone != null ? this._appService._wsUrl.concat("diag/websocket/" + localStorage.getItem('phone')) : this.setErr());
  ngOnInit() {
    // console.log(this.data,this._expertInfo);
    // this._expertInfo.headUrl = this.data.headUrl;
    var self = this;
    $('#file1').change(function () {
      if (this.files.length <= 4) {
        self.getObjectURL(this.files[0], '#img1', $('#file1').parent());
      }else{
        this.messageModal.show();
        this.message = '最大上传4张图片';
      }
    })
    self.sktMsg();

  }
  
  // 获取图片URL
  getObjectURL(file, el, parent) {
    console.log(file, document.getElementById('file1'));
    var maxM = 1024 * 1024 * 5;
    if (!/image\/\w+/.test(file.type)) {
      alert("文件必须为图片！");
      return false;
    } else if (file.size < maxM) {
      console.log(parent[0], '111111', );
      this._appService.formData('http://42.159.202.20:22222/images', parent[0]).then(res => {
        console.log(res);
        let data = res.result;
        for(let item of data){
          console.log(item);
        this._Feedbacks.feedBackFilesDto.push(item);
        }
        console.log(this._Feedbacks.feedBackFilesDto);
        // this._feedBackFileList = new feedBackFileList();
      }).catch(err => {
        console.log(err);
      })
    } else {
      alert('请上传小于5M的图片');
      return false;
    }
  }
  // 意见反馈删除图片
  deleteImg(i){
    this._Feedbacks.feedBackFilesDto.splice(i,1);
  }
  // 提交意见反馈
  update() {
    this.feedbackModal.hide();
    this._homeService.feedbacks(this._Feedbacks).then(res=>{
      if(res.errcode==0){
        this.message = '反馈成功';
        this._Feedbacks = new Feedbacks();
        this.messageModal.show();
      }
    }).catch(err=>{
      if(err){
        this.message = JSON.parse(err._body).errmsg;
        this.messageModal.show();
      }
    })
  }
  // socket消息
  sendSkt(data){
    
  }

  sktMsg() {
    let self = this;
    this._socket.on('connect', function () {
      console.log('Client has connected to the server! socket连接了');
    });

    /*
     * 监听login 推送（登陆成功后 的返回值 ）
     * @returns  success
     */
    this._socket.on('login', function (data) {
      console.log(data, '登陆成功后 的返回值 ');
    });

    //监听system 推送 ，（退出 刷新 重新登陆 关闭浏览。。。。。操作）
    this._socket.on('system', function (data) {
      console.log(data, '退出 刷新 重新登陆 关闭浏览。。。。。操作');
    });

    //监听public 推送 （发送给所有在线用户通知）
    this._socket.on('public', function (data) {
      console.log(data, '发送给所有在线用户通知');
    });

    //监听bluecollar 推送 （监听蓝领驿家 的业务推送）
    this._socket.on('bluecollar', function (data) {
      self.sktHandleData(data, '监听蓝领驿家的业务推送');
    });

    //监听disconnect 推送 （socket连接断开推送的消息）
    this._socket.on('disconnect', function () {
      this.message = '网络异常，请重新登录';
      this.messageModal.show();
      localStorage.clear();
      this._router.navigate(['/login']);
    });
  }
  sktHandleData(data, errmsg) {
    console.log(data, 'qqqqqqqqqqqqqq');
    console.log(data, errmsg);
    if (data.errcode == 0) {
      this.data = data.result.Messages[0];
      this._homeService.obj.emit(this.data);
      // this._CookieService.put('bluecollar',this.data);
      if (this.data.Extension.type == "PERMISSION") {
        this.playMusic();
        this.permission.SAccount = this.data.Extension.data.SAccount;
        this.permission.SName = this.data.Extension.data.SName;
        this.permission.RoomID = this.data.Extension.data.RoomID;
        this._reply.callId = this.data.Extension.data.RoomID;
        
        this.timeDenial();
      }
      if(this.data.Extension.type=='CLOSE'){
        this._router.navigate(['/home']);
        this._CookieService.removeAll();
        window.location.reload();
      }
    } else {
      alert(data.errmsg + '请重新登录');
      this._router.navigate(['/login']);
    }
  }
  sendMessage(msg: string) {
    this._socket.emit('public', { 'name': 'xiams', 'psw': '12312312' }); // 主动 推送给 public 监听服务
    this._socket.emit('bluecollar', { 'msgType': 'xiams', 'msgContent': { 'name': 'xiams', 'psw': '12312312' } }); // 推送 蓝领驿家
  }
  // 接听
  okPhone() {
    this._reply.callStatus = '1';
    console.log(this._reply);
    let arrayObj = [];
    arrayObj.push({
      'key':'callId',
      'value':this._reply.callId
    });
    arrayObj.push({
      'key':'callStatus',
      'value':this._reply.callStatus
    })
    this._homeService.rePly(arrayObj).then(res => {
      this.remoMusic();
      console.log(res, '请求完成');
      this._CookieService.put("roomName", this._reply.callId);
      this._CookieService.put("vendorKey", "6f1e44acccf84922b8140daa17681007");
      this._router.navigate(['home/video']);
    }).catch(err => {
      console.log(err);
    })
    this.replyModal.hide();

  }
  // 挂断
  escPhone(time?: any) {
    if (time) {
      console.log(time);
      clearTimeout(time)
    }
    this.remoMusic();
    this.replyModal.hide();
    this._reply.callStatus = '2';
    this._homeService.rePly(this._reply).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
  // 30秒拒接
  timeDenial() {
    let self = this;
    self.replyModal.show();
    for (let i = 1; i <= self.secs; i++) {
      let time = setTimeout(() => {
        if (i == self.secs) {
          self.remoMusic();
          self.escPhone(time);
        }
        else {
          self.closeTime = self.secs - i;
        }
      }, i * 1000);

    }
  }
  playMusic() {
    let ph = '../../assets/video/1.mp3';
    $('#div1').html('<audio id="audio1" src="' + ph + '" autoplay="autoplay">你的浏览器不支持html5的video标签</audio>');
    // div.innerHTML = '<embed class="embed" src="' + ph + '" loop="0" autostart="true" >';
    // div.innerHTML = '<audio id="audio1" src="' + ph + '" autoplay="autoplay">你的浏览器不支持html5的video标签</audio>';
    //  document.getElementById('audio1').setAttribute('autoplay','true');
  }
  remoMusic() {
    $('#div1').html('<audio id="audio1" src="" autoplay="autoplay">你的浏览器不支持html5的video标签</audio>');
  }
  // 退出
  outLogin() {
    
    this._homeService.loginout().then(res => {
      console.log(res);
      if (res.errcode == 0) {
        this.staticModal.hide();
        localStorage.clear();
        this._socket.disconnect();
        this._router.navigate(['/login']);

      }
    }).catch(err => {
      console.log(err);
    })
  }
}
