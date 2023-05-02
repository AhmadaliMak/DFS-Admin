import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  userId: any;
  userData: any;

  constructor(private Rest: RestService, private router: Router, private activateRouter: ActivatedRoute, private spinner: NgxSpinnerService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'User List' },
      { label: 'User Detail', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.userId = this.activateRouter.snapshot.paramMap.get('userId');
      this.getUserDetails();
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  getUserDetails() {
    this.spinner.show();
    this.Rest.get(`get-user/${this.userId}`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.userData = res.data;
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
