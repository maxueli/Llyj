import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import {LoginComponent} from './login/login.component'
import {ModifypwdComponent} from './modifypwd/modifypwd.component'
import {HomeComponent} from './home/home.component'

export const appRoutes=[
    {
        path:'',
        redirectTo:'login',
		pathMatch:'full'
    },
    {
        path:'login',
        component:LoginComponent
    },
    {
        path:'modifypwd',
        component:ModifypwdComponent
    },
    {
        path:'home',
        loadChildren:'./home/home.module#HomeModule'
    }
];
export const routedComponents = [ LoginComponent, ModifypwdComponent,];
export const routing = RouterModule.forRoot(appRoutes);