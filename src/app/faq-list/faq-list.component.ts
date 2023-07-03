import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  providers: [NgbModalConfig, NgbModal],
})
export class FaqListComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  faqData: any;
  dtOptions: DataTables.Settings = {};
  modalReference: any;
  closeResult: string;
  currentStatus: any;
  currentFaqId: any;
  currentTopic: any;
  currentQuestion: any;
  currentAnswer: any;
  currentIndex: any;
  currentTitle: any;
  currentType: any;
  faqForm!: FormGroup;
  submitted: boolean = false;
  topicListData: any;

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
      { label: 'Faq List', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      // Code here
      this.faqListAPI();
      this.faqForm = this.formBuilder.group({
        topic: ['', Validators.required],
        question: ['', Validators.required],
        answer: ['', Validators.required],
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

  faqListAPI() {
    const that = this;
    that.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.minNumber = dataTablesParameters.start + 1;
        dataTablesParameters.maxNumber = dataTablesParameters.start + dataTablesParameters.length;
        that.Rest.post('get-faq', dataTablesParameters, this.userDetails.token).subscribe((res: any) => {
          that.faqData = res.data;
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
        // { data: "#", orderable: false },
        { data: "Topic" },
        { data: "Question" },
        { data: "Answer" },
        { data: "Status" },
        { data: "Created Date" },
      ],
    };
  }

  get f() { return this.faqForm.controls; }

  updatefaqData(updateFaqComponent: any, index: any, faqId: any, status: any, type: any, topicId: any, question: any, answer: any) {
    this.getTopic();
    this.currentFaqId = faqId;
    this.currentIndex = index;
    this.currentType = type;
    this.currentStatus = status;
    this.currentTopic = topicId;
    this.currentTopic = question;
    this.currentTopic = answer;
    setTimeout(() => {
      this.faqForm.patchValue({
        topic: topicId,
        question: question,
        answer: answer,
        status: status
      });
    }, 500);
    this.modalReference = this.modalService.open(updateFaqComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'md' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  confirmModalOpen(DialogBoxComponent: any, index: any, faqId: any, status: any, type: any, topic: any, question: any, answer: any) {
    this.currentTopic = topic;
    this.currentQuestion = question; 
    this.currentAnswer = answer;
    this.currentFaqId = faqId;
    this.currentIndex = index;
    this.currentStatus = status;
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
    var faqFormValue = this.faqForm.getRawValue();
    if (this.faqForm.valid) {
      this.updateStatus(this.currentFaqId, this.currentIndex, faqFormValue.status, faqFormValue.topic, faqFormValue.question, faqFormValue.answer, this.currentType);
    }
  }

  updateStatus(faqId: any, index: any, status: any, topic: any, question: any, answer: any, type: any) {
    this.spinner.show();
    if (type == 'faqAdd') {
      this.addData(status, topic, question, answer);
    } else if (type == 'statusUpdate' || type == 'faqUpdate') {
      this.updateSubmitData(faqId, index, status, topic, question, answer, type);
    } else {
      this.deleteData(faqId);
    }
  }

  addData(status: any, topic: any, question: any, answer: any) {
    this.Rest.post(`add-faq`, {
      topicId: topic,
      question: question,
      answer: answer,
      status: String(status)
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Faq data added successfully.');
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

  updateSubmitData(faqId: any, index: any, status: any, topic: any, question: any, answer: any, type: any) {
    this.Rest.post(`update-faq`, {
      topicId: topic,
      question: question,
      answer: answer,
      status: String(status),
      _id: faqId
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          if (type == 'statusUpdate') {
            this.notifier.notify('success', 'Faq status updated successfully.');
            this.faqData.data[index].status = status;
          } else {
            this.notifier.notify('success', 'Faq details updated successfully.');
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

  deleteData(faqId: any) {
    this.Rest.get(`delete-faq/${faqId}`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Faq delete successfully.');
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

  getTopic() {
    this.spinner.show()
    this.Rest.get(`get-topic`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.topicListData = res.data;
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
