import { CommonModule } from '@angular/common';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ModalModule, PaginationModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { routesComponents, routing } from './manage.routings'
import { AccordionModule } from 'ngx-bootstrap';
import { manageService } from './manage.service'
import { BasicInfoService } from './basic-info/basic-info.service';
import { SkillInfoService } from './skill-info/skill-info.service';

@NgModule({
    declarations: [
        routesComponents
    ],
    imports: [
        routing,
        FormsModule,
        HttpModule,
        CommonModule,
        ModalModule.forRoot(),
        AccordionModule.forRoot(),
        PaginationModule.forRoot(),
    ],
    exports: [],
    providers: [manageService, BasicInfoService, SkillInfoService],
    // bootstrap: [HomeComponent]
})
export class ManageModule { }