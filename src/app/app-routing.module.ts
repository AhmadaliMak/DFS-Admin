import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { FullComponent } from './layouts/full/full.component';
import { ChangePaswordComponent } from './change-pasword/change-pasword.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentEditComponent } from './content-edit/content-edit.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      { 
        path: 'login', 
        component: LoginComponent 
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'change-password',
        component: ChangePaswordComponent
      },
      {
        path: 'user-list',
        component: UserListComponent,
      },
      {
        path: 'user-detail/:userId',
        component: UserDetailComponent,
      },
      {
        path: 'edit-content/:contentId',
        component: ContentEditComponent,
      },
      {
        path: 'content-list',
        component: ContentListComponent
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/dashboard'
  }
];
