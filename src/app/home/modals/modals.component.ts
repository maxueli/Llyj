import { Component, Input, ViewChild, OnInit, Output, EventEmitter, AfterViewInit,AfterViewChecked } from '@angular/core';

import { ModalDirective } from 'ngx-bootstrap/modal';
@Component({
    selector: 'modals',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.scss']
})
export class ModalsComponent implements OnInit, AfterViewInit,AfterViewChecked {
    @Input('contnet') contentInfo: string;
    @Output() mytry = new EventEmitter<any>();
    @ViewChild('staticModal') public staticModal: ModalDirective;
    ngOnInit() {
        
    }

    ngAfterViewInit() {
        this.show();
    }
    ngAfterViewChecked(){

    }
    public show() {
        if (this.contentInfo) {
            this.staticModal.show();
        }
    }
    public hide(){
        this.staticModal.hide();
        this.mytry.emit(5);
        console.log(this.contentInfo);
    }
}
