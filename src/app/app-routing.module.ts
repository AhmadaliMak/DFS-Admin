import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';

import { FullComponent } from './layouts/full/full.component';
import { ChangePaswordComponent } from './change-pasword/change-pasword.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { ContentListComponent } from './content-list/content-list.component';
import { ContentEditComponent } from './content-edit/content-edit.component';
import { TopicListComponent } from './topic-list/topic-list.component';
import { FaqListComponent } from './faq-list/faq-list.component';
import { HIWRulesComponent } from './HIW-rules/HIW-rules.component';
import { GeneralSettingComponent } from './general-setting/general-setting.component';
import { ContestListComponent } from './contest-list/contest-list.component';
import { ContestAddEditComponent } from './contest-add-edit/contest-add-edit.component';

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
        path: 'add-contest',
        component: ContestAddEditComponent,
      },
      {
        path: 'edit-contest/:contestId',
        component: ContestAddEditComponent,
      },
      {
        path: 'content-list',
        component: ContentListComponent,
      },
      {
        path: 'topic-list',
        component: TopicListComponent,
      },
      {
        path: 'faq-list',
        component: FaqListComponent,
      },
      {
        path: 'hiw-rules',
        component: HIWRulesComponent,
      },
      {
        path: 'general-setting',
        component: GeneralSettingComponent,
      },
      {
        path: 'contest-list',
        component: ContestListComponent,
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
