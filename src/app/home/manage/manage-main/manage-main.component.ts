import { Component } from '@angular/core';
import {flyIn} from "../../../animations/fly-In";

@Component({
  selector: 'manage-main',
  templateUrl: './manage-main.component.html',
  styleUrls: ['./manage-main.component.scss'],
  animations:[
    flyIn
  ]
})
export class ManageMainComponent {
  
}
