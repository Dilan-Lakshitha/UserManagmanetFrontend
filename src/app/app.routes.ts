import { Routes } from '@angular/router';
import { DashboardComponent } from './main/component/dashboard/dashboard.component';
import { AuthGuard } from './main/auth.guard';

export const routes: Routes = [
    {path: '', redirectTo: 'user-register', pathMatch: 'full'},
    {path:'user-register', loadComponent:()=>import('./main/component/user-registor/user-registor.component').then(m=>m.UserRegistorComponent)},
    {path:'user-login', loadComponent:()=>import('./main/component/user-login/user-login.component').then(m=>m.UserLoginComponent)},
    {
        path: '',
        component: DashboardComponent,
        children: [
          { path: 'dashboard', loadComponent: () => import('./main/component/dashboard/dashboard.component').then(m => m.DashboardComponent), canActivate: [AuthGuard] },
        ],
    },
];