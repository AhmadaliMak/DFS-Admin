import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

@Component({
  selector: 'app-hiw-rules',
  templateUrl: './hiw-rules.component.html',
  providers: [NgbModalConfig, NgbModal],
})
export class HIWRulesComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  rulesData: any;
  dtOptions: DataTables.Settings = {};
  modalReference: any;
  closeResult: string;
  currentStatus: any;
  currentRulesId: any;
  currentIndex: any;
  currentTitle: any;
  currentType: any;
  rulesForm!: FormGroup;
  submitted: boolean = false;
  sportListData: any;
  public Editor = ClassicEditor;

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
      { label: 'How It Work Rules', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.rulesListAPI();
      this.getSport();
      this.rulesForm = this.formBuilder.group({
        sport_name: ['', Validators.required],
        title: ['', Validators.required],
        content: ['', Validators.required]
      });
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  rulesListAPI() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      columnDefs: [{
        "targets": [1],
        "orderable": false
      }],
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.minNumber = dataTablesParameters.start + 1;
        dataTablesParameters.maxNumber = dataTablesParameters.start + dataTablesParameters.length;
        this.Rest.post('get-game-rules', dataTablesParameters, this.userDetails.token).subscribe((res: any) => {
          this.rulesData = res.data;
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
        { data: "Sport Name" },
        { data: "Created Date" },
      ],
    };
  }

  getSport() {
    this.spinner.show()
    this.Rest.get(`get-sports`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.sportListData = res.data;
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

  get f() { return this.rulesForm.controls; }

  updateRulesData(updateRulesComponent: any, index: any, rulesId: any, data: any, type: any) {
    this.currentRulesId = rulesId;
    this.currentIndex = index;
    this.currentType = type;
    if(this.currentType == 'rulesAdd') {
      this.rulesForm.reset();
      this.submitted = false;
    } 
    this.setValueNew(data);
    this.modalReference = this.modalService.open(updateRulesComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'lg' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  setValueNew(dataValue: any) {
    this.rulesForm.patchValue({
      sport_name: dataValue?.sportsId ? dataValue?.sportsId : '',
      title: dataValue?.title ? dataValue?.title : '',
      content: dataValue?.content ? dataValue?.content : ''
    });
  }

  confirmModalOpen(DialogBoxComponent: any, index: any, rulesId: any, status: any, title: any, type: any) {
    this.currentRulesId = rulesId;
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
    var rulesFormValue = this.rulesForm.getRawValue();
    if (this.rulesForm.valid) {
      if (this.currentType == 'rulesAdd') {
        this.addData(rulesFormValue);
      } else if (this.currentType == 'rulesUpdate') {
        this.updateSubmitData(this.currentRulesId, rulesFormValue);
      }
    }
  }

  addData(data: any) {
    this.Rest.post(`add-game-rules`, {
      'sportsId': parseInt(data?.sport_name),
      'title': data?.title,
      'content': data?.content
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Rules data added successfully.');
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

  updateSubmitData(rulesId: any, data: any) {
    this.Rest.post(`update-game-rules`, {
      'sportsId': parseInt(data?.sport_name),
      '_id': rulesId,
      'title': data?.title,
      'content': data?.content
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'Rules details updated successfully.');
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

  deleteData(rulesId: any) {
    this.notifier.notify('success', 'Coming Soon');
    // this.Rest.get(`delete-rules/${rulesId}`, this.userDetails.token).subscribe({
    //   next: (res: any) => {
    //     if (res.status == 200) {
    //       this.notifier.notify('success', 'Rules delete successfully.');
    this.spinner.hide();
    this.modalReference.close();
    this.rerender();
    //     } else {
    //       this.spinner.hide();
    //       this.notifier.notify('error', res.msg);
    //     }
    //   },
    //   error: error => {
    //     this.spinner.hide();
    //     this.notifier.notify("error", error.message);
    //   }
    // });
  }

  rerender(): void {
    $('.custom-datatable table.dataTable').DataTable().ajax.reload()
  }

}
