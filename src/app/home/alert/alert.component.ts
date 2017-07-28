import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
    selector: 'app-alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.scss']
})
export class Alertcomponent implements OnInit, AfterViewInit {
    @ViewChild('massageModal') public massageModal: ModalDirective;

    @Input() msg;
    @Output() childEvent = new EventEmitter<any>();


    public message: string;
    constructor() { }
    ngOnInit() {
        console.log(this.msg);

    }
    ngAfterViewInit() {
        if (this.msg != undefined) {
            this.message = this.msg;
            this.massageModal.show();
            this.msg=undefined;
        }

    }
    close() {
        this.msg=undefined;
        this.massageModal.hide();
        this.childEvent.emit('关闭了');
    }
}
