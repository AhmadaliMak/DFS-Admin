import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-topic-list',
  templateUrl: './topic-list.component.html',
  providers: [NgbModalConfig, NgbModal],
})
export class TopicListComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  topicData: any;
  dtOptions: DataTables.Settings = {};
  modalReference: any;
  closeResult: string;
  currentStatus: any;
  currentTopicId: any;
  currentIndex: any;
  currentTitle: any;
  currentType: any;
  topicForm!: FormGroup;
  submitted: boolean = false;

  constructor(private Rest: RestService, private router: Router, private spinner: NgxSpinnerService, notifier: NotifierService, config: NgbModalConfig, private modalService: NgbModal, public formBuilder: FormBuilder) {
    this.notifier = notifier;
    config.backdrop = 'static';
    config.keyboard = false;
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      { label: 'FAQ Management' },
      { label: 'Topic List', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      // Code here
      this.topicListAPI();
      this.topicForm = this.formBuilder.group({
        title: ['', Validators.required],
        status: ['', Validators.required]
      });
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  topicListAPI() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.minNumber = dataTablesParameters.start + 1;
        dataTablesParameters.maxNumber = dataTablesParameters.start + dataTablesParameters.length;
        this.Rest.post('get-topic-with-filter', dataTablesParameters, this.userDetails.token).subscribe((res: any) => {
          this.topicData = res.data;
          this.spinner.hide();
          callback({
            recordsTotal: res.data.recordsTotal,
            recordsFiltered: res.data.recordsFiltered,
            data: [],
          });
        }, (err: any) => {
          this.spinner.hide();
          this.notifier.notify('error', err);
        });
      },
      columns: [
        { data: "Title" },
        { data: "Status" },
        { data: "Created Date" },
      ],
    };
  }

  get f() { return this.topicForm.controls; }

  updateTopicData(updateTopicComponent: any, index: any, topicId: any, tiltle: any, status: any, type: any) {
    this.currentTopicId = topicId;
    this.currentIndex = index;
    this.currentType = type;
    this.topicForm.patchValue({
      title: tiltle,
      status: status
    });
    this.modalReference = this.modalService.open(updateTopicComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'md' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmModalOpen(DialogBoxComponent: any, index: any, topicId: any, status: any, title: any, type: any) {
    this.currentTopicId = topicId;
    this.currentIndex = index;
    this.currentStatus = status;
    this.currentTitle = title;
    this.currentType = type;

    this.modalReference = this.modalService.open(DialogBoxComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'sm' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  onSubmit() {
    this.submitted = true;
    // this.getRefreshToken();
    var topicFormValue = this.topicForm.getRawValue();
    if (this.topicForm.valid) {
      this.updateStatus(this.currentTopicId, this.currentIndex, topicFormValue.status, topicFormValue.title, this.currentType);
    }
  }

  updateStatus(topicId: any, index: any, status: any, title: any, type: any) {
    this.spinner.show();
    if (type == 'topicAdd') {
      this.addData(status, title);
    } else if (type == 'statusUpdate' || type == 'topicUpdate') {
      this.updateSubmitData(topicId, index, status, title, type);
    } else {
      this.deleteData(topicId);
    }
  }

  addData(status: any, title: any) {
    this.Rest.post(`add-topic`, {
      status: String(status),
      title: title
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Topic data added successfully.');
          this.spinner.hide();
          this.modalReference.close();
          this.rerender();
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

  updateSubmitData(topicId: any, index: any, status: any, title: any, type: any) {
    this.Rest.post(`update-topic`, {
      _id: topicId,
      status: String(status),
      title: title
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (type == 'statusUpdate') {
            this.notifier.notify('success', 'Topic status updated successfully.');
            this.topicData.data[index].status = status;
          } else {
            this.notifier.notify('success', 'Topic details updated successfully.');
          }
          this.spinner.hide();
          this.modalReference.close();
          this.rerender();
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

  deleteData(topicId: any) {
    this.Rest.get(`delete-topic/${topicId}`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Topic delete successfully.');
          this.spinner.hide();
          this.modalReference.close();
          this.rerender();
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

  rerender(): void {
    $('.custom-datatable table.dataTable').DataTable().ajax.reload()
  }

}
