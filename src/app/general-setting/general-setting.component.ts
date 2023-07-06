import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
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
  userDetail: any;
  modalReference: any;
  notifier: NotifierService;
  newToken: any;
  currentType: any;
  submitted: boolean = false;
  versionForm: FormGroup;
  versionData: any;

  constructor(
    private Rest: RestService,
    private router: Router,
    private spinner: NgxSpinnerService,
    notifier: NotifierService,
    public formBuilder: FormBuilder
  ) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Settings', active: true }
    ];

    this.userDetail = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetail == null) {
      this.router.navigate(["login"]);
    } else {
      this.versionForm = this.formBuilder.group({
        androidVersion: ['', Validators.required],
        iosVersion: ['', Validators.required]
      });
      this.getVersionData();
    }
  }

  get f() { return this.versionForm.controls; }

  getVersionData() {
    this.spinner.show()
    this.Rest.get(`get-settings`, this.userDetail.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.versionData = res.data;
          this.setValueNew(this.versionData)
          this.spinner.hide();
        } else {
          this.spinner.hide();
          this.notifier.notify('error', res.msg);
        }
      },
      error: error => {
        this.spinner.hide();
        this.notifier.notify("error", error.message);
      }
    });
  }

  onSubmit() {
    this.submitted = true;
    if (this.versionForm.invalid) {
      return;
    }
    var versionFormValue = this.versionForm.getRawValue();
    if (this.versionForm.valid) {
      this.addData(versionFormValue);
    }
  }

  setValueNew(dataValue: any) {
    this.versionForm.patchValue({
      androidVersion: dataValue?.android_version ? dataValue?.android_version : '',
      iosVersion: dataValue?.ios_version ? dataValue?.ios_version : ''
    });
  }

  addData(data: any) {
    let obj = {
      data: {
        'android_version': data?.androidVersion,
        'ios_version': data?.iosVersion
      }
    }
    this.Rest.post(`update-settings`, obj, this.userDetail.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', res.msg);
          this.spinner.hide();
          this.modalReference.close();
        } else {
          this.spinner.hide();
          this.notifier.notify('error', res.msg);
        }
      },
      error: error => {
        this.spinner.hide();
        this.notifier.notify("error", error.message);
      }
    });
  }
}







