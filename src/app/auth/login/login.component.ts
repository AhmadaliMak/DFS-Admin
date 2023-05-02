import { Component, OnInit, ViewChildren, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { RestService } from '../../../app/service/rest.service';
import { NotifierService } from 'angular-notifier';
import { NgxSpinnerService } from "ngx-spinner";
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  submitted: boolean = false;
  SignupForm: FormGroup;
  password = 'password';
  show = false;
  notifier: NotifierService;

  constructor(private Rest: RestService, private router: Router, private _fb: FormBuilder, notifier: NotifierService, private spinner: NgxSpinnerService) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    var sessionStorage = this.Rest.getSessionStorage();
    if (sessionStorage != null) {
      this.router.navigate(["dashboard"]);
    }
    var body = document.getElementsByTagName('body')[0];
    body.classList.add('auth-page');
    this.SignupForm = this._fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  get f() {
    return this.SignupForm.controls;
  }

  onSubmit() {
    var loginFormValue = this.SignupForm.getRawValue();
    this.submitted = true;
    if (this.SignupForm.valid) {
      this.spinner.show();
      this.Rest.post('login', {
        'email': loginFormValue.email,
        'password': loginFormValue.password
      }, environment.APIKey).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.Rest.setSessionStorage(JSON.stringify(res.data));
            this.notifier.notify('success', res.msg);
            this.spinner.hide();
            this.router.navigate(["dashboard"]);
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

  hideShowPass() {
    if (this.password === 'password') {
      this.password = 'text';
      this.show = true;
    } else {
      this.password = 'password';
      this.show = false;
    }
  }

  ngOnDestroy() {
    var body = document.getElementsByTagName('body')[0];
    body.classList.remove('auth-page');
  }

}
