import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-content-list',
  templateUrl: './content-list.component.html',
})
export class ContentListComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  contentData: any;

  constructor(private Rest: RestService, private router: Router, private spinner: NgxSpinnerService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Content Management', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      // Code here
      this.getContentListAPI();
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  getContentListAPI() {
    this.spinner.show();
    this.Rest.get(`get-content`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.contentData = res.data;
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
}
