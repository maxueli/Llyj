import { Component, OnInit, AfterViewInit,ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

import { CookieService } from 'angular2-cookie/services/cookies.service';
import { VideosService } from './videos.service'
import { HomeService } from '../home.service'
import { Router } from '@angular/router';

import { ProgressbarModule } from 'ngx-bootstrap'

import { videosFile, callfile, callInfo } from './videos'
// import {expertInfo}  from '../../app.model'
declare function LoadVideo(): any;
@Component({
  selector: 'videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.scss']
})
export class VideosComponent implements OnInit, AfterViewInit {
  @ViewChild('messageModal') public messageModal: ModalDirective;
  public setStatus: boolean = true;
  public dynamic: number = 0;
  public showFile: Array<any> = [];
  public _videosFile = new videosFile();
  public _callfile = new callfile();
  public _callInfo = new callInfo();
  public message:string='';


  // 邀请专家
  public otherFriend = [];
  public friend = {};
  public selected = false;


  public bluecollar;



  // public expertInfo:expertInfo = new  expertInfo();
  public videosInfo: any = JSON.parse(localStorage.getItem('IDENTITY'));
  constructor(
    private _VideosService: VideosService,
    private _router: Router,
    private _cookie: CookieService,
    private _home: HomeService
  ) {
    this._home.obj.subscribe(value => {
      this.bluecollar = value;
      console.log("----------------------------------------"+this.bluecollar+'************************************');
    })
  }
  ngOnInit() {
    // this.expertInfo.headUrl = this.videosInfo.headUrl;
    // this.expertInfo.realName = this.videosInfo.realName;
    // this.expertInfo.mobile = this.videosInfo.mobile;
    // this.expertInfo.starRating = this.videosInfo.otherInfo.starRating;
    this.getfile();
    this.getcallInfo()
    // console.log(this.videosInfo)
    // this.bluecollar = this._cookie.get('bluecollar');
    // console.log(this.bluecollar);
  }
  ngAfterViewInit() {
    // console.log(1111111);

    // top: this.fileTop(this.filelength),
    // 'height': this.fileHeight(this.filelength) + 'px'

  }
  getcallInfo() {
    this._VideosService.getcallinfo(this._cookie.get('roomName')).then(res => {
      console.log(res);
      if (res.errcode == 0) {
        let data = res.result;
        this._callInfo.brand = data.brand;
        this._callInfo.headUrl = data.headUrl;
        this._callInfo.name = data.name;
        this._callInfo.faultRange = data.faultRange;

      }
    }).catch(err => {
      console.log(err);
    })
  }
  tem = setTimeout(() => {
    LoadVideo();
  }, 1000);
  // 添加联系人
  addExpert() {
    // console.log(this._cookie.get('roomName'))
    this.friend = {};
    this.selected = false;
    let arrayObj = [];
    arrayObj.push({ 'key': 'roomId', 'value': this._cookie.get('roomName') });
    this._VideosService.findexpertlist(arrayObj).then(res => {
      console.log(res);
      if (res.errcode == 0) {
        this.otherFriend = res.result;
      }
    }).catch(err => {
      console.log(err);

    })
  }
  // 选择好友
  selectfriend(obj) {
    console.log(obj);
    this.friend = obj;
    this.selected = true;
  }
  // 直通专家
  Okyqfriend() {
    let arrayObj = [];
    arrayObj.push({
      'key': 'roomId',
      'value': this._cookie.get('roomName')
    });
    arrayObj.push({
      'key': 'expertId',
      'value': this.friend['expertId']
    })
    this._VideosService.straighExperts(arrayObj).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    })
  }
  // 上传文件
  videoUpFile() {
    // this.setStatus = false;
    this._VideosService.upFiles($('#upfiles')[0]).then(res => {
      console.log(res);
      let data = res.result;
      this._callfile.callId = 1;
      this._callfile.fileName = data.fileName;
      this._callfile.fileSize = data.fileSize;
      this._callfile.fileSubffix = data.fileSubffix;
      this._callfile.fileUrl = data.fileName;
      this._VideosService.videopostFile(this._callfile).then(res => {
        console.log(res);
        this.message = '上传成功';
        this.messageModal.show();
      }).catch(err => {
        this.message = '上传失败';
        this.messageModal.show();
        console.log(err);
      })
    }).catch(err => {
      console.log(err);
    })
  }
  public getFindcallhistory() {
    this.setStatus = !this.setStatus;
  }
  public getfile() {
    this._VideosService.videogetFile(1).then(res => {
      this.showFile = res.result;
      this.dynamic = 100;
      console.log(this.showFile);
    }).catch(err => {
      console.log(err);
    })
  }

  public share() {
    console.log('开始分享！')
  }
  public camera() {
    console.log('相机');
  }
  public pick_up_head() {
    console.log('摄像头')
  }



  public phoneEnd() {
    let arrayObj = [];
    arrayObj.push({
      'key': 'callId',
      "value": this._cookie.get('roomName')
    });
    console.log(this._cookie.get('roomName'));
    this._VideosService.exitcall(arrayObj).then(res => {
      console.log(res);
      this._cookie.removeAll();
      this._router.navigate(['/home']);
      window.location.reload();
    }).catch(err => {
      console.log(err);
    })
    // console.log('挂断电话');
  }


}
