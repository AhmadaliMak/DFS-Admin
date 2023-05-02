import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-content-edit',
  templateUrl: './content-edit.component.html'
})
export class ContentEditComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  contentId: any;
  contentData: any;
  contentForm!: FormGroup;
  submitted: boolean = false;
  public Editor = ClassicEditor;

  constructor(private Rest: RestService, private router: Router, private activateRouter: ActivatedRoute, private spinner: NgxSpinnerService, notifier: NotifierService, public formBuilder: FormBuilder) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Content Management' },
      { label: 'Edit Content', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.contentId = this.activateRouter.snapshot.paramMap.get('contentId');
      this.contentForm = this.formBuilder.group({
        title: ['', Validators.required],
        content: ['', Validators.required]
      });
      this.getContentDetail();
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  getContentDetail() {
    this.spinner.show();
    this.Rest.get(`get-content/${this.contentId}`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.contentData = res.data;
          this.contentForm.patchValue({
            title: this.contentData.title,
            content: this.contentData.content
          });
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

  get f() { return this.contentForm.controls; }

  onSubmit() {
    this.submitted = true;
    // this.getRefreshToken();
    var contentFormValue = this.contentForm.getRawValue();
    if (this.contentForm.valid) {
      this.spinner.show();
      this.Rest.post('update-content', {
        '_id': parseInt(this.contentId),
        'title': contentFormValue.title,
        'content': contentFormValue.content
      }, this.userDetails.token).subscribe({
        next: (res: any) => {
          if (res.status == 200) {
            this.notifier.notify('success', res.msg);
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

}
