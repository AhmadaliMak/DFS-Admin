import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';

import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  providers: [NgbModalConfig, NgbModal],
})
export class UserListComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  userData: any;
  dtOptions: DataTables.Settings = {};
  modalReference: any;
  closeResult: string;
  currentUserStatus: any;
  currentUserId: any;
  currentIndex: any;

  constructor(private Rest: RestService, private router: Router, private spinner: NgxSpinnerService, notifier: NotifierService, config: NgbModalConfig, private modalService: NgbModal) {
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
      { label: 'User List', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      // Code here
      this.userListAPI();
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  userListAPI() {
    const that = this;
    that.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.minNumber = dataTablesParameters.start + 1;
        dataTablesParameters.maxNumber = dataTablesParameters.start + dataTablesParameters.length;
        that.Rest.post('user-list', dataTablesParameters, this.userDetails.token).subscribe((res: any) => {
          that.userData = res.data;
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
        { data: "User Name" },
        { data: "Email" },
        { data: "Mobile No." },
        { data: "Referal Code" },
        { data: "Login With" },
        { data: "Deposite Amount" },
        { data: "Winning Amount" },
        { data: "Bonus Amount" },
        { data: "Registered Since" },
        // { data: "Status" },
      ],
    };
  }

  confirmModalOpen(DialogBoxComponent: any, index: any, userId: any, status: any) {
    this.currentUserId = userId;
    this.currentIndex = index;
    this.currentUserStatus = status;
    this.modalReference = this.modalService.open(DialogBoxComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'sm' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  updateStatus(userId: any, index: any, status: any) {
    this.spinner.show();
    this.Rest.get(`update-user-status/${userId}/${status}`,this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', 'User status updated successfully.');
          this.userData.data[index].status = status;
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
