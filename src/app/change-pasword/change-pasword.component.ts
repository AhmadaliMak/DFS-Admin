import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

import { MustMatch } from './validation.mustmatch';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-change-pasword',
  templateUrl: './change-pasword.component.html'
})
export class ChangePaswordComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  validationForm!: FormGroup;
  submitted = false;
  userDetails: any;
  password = 'password';
  password1 = 'password';
  password2 = 'password';
  show = false;
  show1 = false;
  show2 = false;
  notifier: NotifierService;
  newToken: any;

  constructor(private Rest: RestService, private router: Router, public formBuilder: FormBuilder, private spinner: NgxSpinnerService, notifier: NotifierService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'Change Password', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.validationForm = this.formBuilder.group({
        oldPassword: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")]],
        confirmPassword: ['', Validators.required]
      }, {
        validator: MustMatch('newPassword', 'confirmPassword'),
      });
    }
  }

  hideShowPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  hideShowPass1() {
    if (this.password1 === 'password') {
      this.password1 = 'text';
      this.show1 = true;
    } else {
      this.password1 = 'password';
      this.show1 = false;
    }
  }

  hideShowPass2() {
    if (this.password2 === 'password') {
      this.password2 = 'text';
      this.show2 = true;
    } else {
      this.password2 = 'password';
      this.show2 = false;
    }
  }

  get f() { return this.validationForm.controls; }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  onSubmit() {
    this.submitted = true;
    // this.getRefreshToken();
    var cpFormValue = this.validationForm.getRawValue();
    if (this.validationForm.valid) {
      this.spinner.show();
      // 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC8xOTIuMTY4LjEuMTIzXC9zcG9ydHNhcHBcL2FwaVwvYWRtaW5cL2xvZ2luIiwiaWF0IjoxNjgyNTA3ODc0LCJleHAiOjE2ODI1MTE0NzQsIm5iZiI6MTY4MjUwNzg3NCwianRpIjoiRTUwbFdGSTFXSnhNV1c4RSIsInN1YiI6MSwicHJ2IjoiMjNiZDVjODk0OWY2MDBhZGIzOWU3MDFjNDAwODcyZGI3YTU5NzZmNyJ9.i8Bs35WjCM5nxeXpYz1XO8NdjxcTUzteiWifCrrlAUc'
      this.Rest.post('change-password', {
        'old_password': cpFormValue.oldPassword,
        'password': cpFormValue.newPassword
      }, this.userDetails.token).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.notifier.notify('success', res.msg);
            this.spinner.hide();
            localStorage.clear();
            this.router.navigate(["login"]);
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
}
