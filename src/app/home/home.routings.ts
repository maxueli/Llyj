import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './home.component';
import { VideosComponent } from './videos/videos.component';
import {ModalsComponent} from './modals/modals.component'
import {HomeInfoComponent} from './home-info/home-info.component'
// import {Alertcomponent} from './alert/alert.component'

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path:'',
                component:HomeInfoComponent
            },
            {
                path: 'video',  
                component: VideosComponent
            },
            {
                path: 'manage',
                loadChildren: './manage/manage.module#ManageModule'
            }
        ]
    }
];
export const routedComponents = [
    HomeComponent,
    VideosComponent,
    ModalsComponent,
    HomeInfoComponent,
    // Alertcomponent
];
export const routing = RouterModule.forChild(routes);