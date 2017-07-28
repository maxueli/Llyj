import { Component, AfterViewInit, OnInit, ViewChild } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
import { flyIn } from '../../animations/fly-In'
import { Router } from '@angular/router';

import { HomeService } from '../home.service'

import { expertInfo } from '../../app.model'

@Component({
  selector: 'home-info',
  templateUrl: './home-info.component.html',
  styleUrls: ['./home-info.component.scss'],
  animations: [
    flyIn
  ]
})
export class HomeInfoComponent implements OnInit, AfterViewInit {
  @ViewChild('massageModal') public massageModal: ModalDirective;

  public message: string = "";
  public data = JSON.parse(localStorage.getItem('IDENTITY'));
  public _expertInfo: expertInfo = new expertInfo();
  public starIcon = [];
  public starNum: number;
  public loading: boolean;
  constructor(
    private _homeService: HomeService,
    private _router: Router
  ) {

  }
  ngOnInit() {
    if (this.data) {
      this._expertInfo.headUrl = this.data.headUrl;
      this._expertInfo.realName = this.data.realName;
      this._expertInfo.mobile = this.data.mobile;
    }else{
      alert('网路异常，请重新登录');
    }

    this.getExpert()
    // console.log(this.data, this._expertInfo);
  }
  ngAfterViewInit() {
    // console.log(this._expertInfo);
  }
  getExpert() {
    this.loading = true;
    this._homeService.getExpertdata().then(res => {
      // console.log(res);
      if (res.errcode == 0) {
        this.loading = false;

        let data = res.result;
        this._expertInfo.starRating = data.expertStar;
        this._expertInfo.seekHelpNum = data.seekHelpNum;
        this._expertInfo.answerNum = data.answerNum;
        this.starNum = data.expertStar;
        this.setStarIcon()
      }
    }).catch(err => {

      let error = JSON.parse(err._body);
      this.message = error.errmsg;
      this.massageModal.show();
      console.log(err._body);
    })
  }
  closeMassageModal() {
    this.massageModal.hide();
    this._router.navigate(['/login']);
  }
  //设置星星
  setStarIcon() {
    this.starIcon = [];
    let starNum: number;
    if (this.starNum > 5) {
      starNum = 5;
    } else if (this.starNum < 0) {
      starNum = 0;
    } else {
      starNum = this.starNum;
    }
    let star_1 = parseInt(5 - starNum + '');//空心
    let star_2 = starNum - parseInt(starNum + '');//半心
    let star_3 = parseInt(starNum + '');//全心
    for (let i = 0; i < star_3; i++) {
      this.starIcon.push({ 'icon': '../../../assets/img/star-1.png' });//全
    }
    if (star_2 > 0 && star_2 < 1) {
      this.starIcon.push({ 'icon': '../../../assets/img/star-5.png' });//半
    }
    for (let i = 0; i < star_1; i++) {
      this.starIcon.push({ 'icon': '../../../assets/img/star-2.png' })//空
    }

  }
}
