import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Routes, RouterModule } from "@angular/router";
import { DashboardComponent } from "./dashboard.component";
import { TopCardsComponent } from "./dashboard-components/top-cards/top-cards.component";
import { PagetitleComponent } from "../shared/pagetitle/pagetitle.component";
import { IconsModule } from '../icons/icons.module';
import { ChangePaswordComponent } from "../change-pasword/change-pasword.component";
import { UserListComponent } from "../user-list/user-list.component";
import { TopicListComponent } from '../topic-list/topic-list.component';
import { HIWRulesComponent } from "../HIW-rules/HIW-rules.component";
import { UserDetailComponent } from '../user-detail/user-detail.component';
import { CountToModule } from 'angular-count-to';
import { DataTablesModule } from 'angular-datatables';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ContentListComponent } from "../content-list/content-list.component";
import { ContentEditComponent } from "../content-edit/content-edit.component";
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { FaqListComponent } from "../faq-list/faq-list.component";
import { GeneralSettingComponent } from "../general-setting/general-setting.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Dashboard",
      urls: [{ title: "Dashboard", url: "/dashboard" }, { title: "Dashboard" }],
    },
    component: DashboardComponent,
  },
];

@NgModule({
  imports: [
    FormsModule,
    IconsModule,
    NgbModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
    CountToModule,
    DataTablesModule,
    CKEditorModule
  ],
  declarations: [
    DashboardComponent,
    PagetitleComponent,
    TopCardsComponent,
    ChangePaswordComponent,
    UserListComponent,
    ContentListComponent,
    UserDetailComponent,
    ContentEditComponent,
    TopicListComponent,
    HIWRulesComponent,
    FaqListComponent,
    GeneralSettingComponent
  ],
})
export class DashboardModule {}
