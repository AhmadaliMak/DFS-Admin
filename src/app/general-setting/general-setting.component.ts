import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NotifierService } from 'angular-notifier';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  
  constructor(private Rest: RestService, private router: Router, private spinner: NgxSpinnerService, notifier: NotifierService, public formBuilder: FormBuilder) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
        // BreadCrumb
        this.breadCrumbItems = [
          { label: 'Dashboard' },
          { label: 'Settings', active: true }
        ];
  }

}
