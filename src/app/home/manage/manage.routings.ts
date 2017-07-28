import { RouterModule, Routes } from '@angular/router';

import {ManageMainComponent} from './manage-main/manage-main.component';
import {AuthenticationInfoComponent} from './authentication-info/authentication-info.component'
import {BasicInfoComponent} from './basic-info/basic-info.component'
import {SkillInfoComponent} from './skill-info/skill-info.component'
export const routes:Routes = [
    {
        path:'',
        component:ManageMainComponent,
        children:[
            {
                path: '',
                redirectTo: 'basic',
                pathMatch: 'full'
            },
            {
                path: 'basic',
                component: BasicInfoComponent
            },
            {
                path: 'skill',
                component: SkillInfoComponent
            },
            {
                path:'authentication',
                component:AuthenticationInfoComponent
            },
        ]
    }
]
export const routesComponents = [
    ManageMainComponent,
    BasicInfoComponent,
    SkillInfoComponent,
    AuthenticationInfoComponent


]
export const routing = RouterModule.forChild(routes);