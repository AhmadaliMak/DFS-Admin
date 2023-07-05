import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { NgbModalConfig, NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-contest-list',
  templateUrl: './contest-list.component.html',
})
export class ContestListComponent implements OnInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  contestData: any;
  dtOptions: DataTables.Settings = {};
  currentContestId: any;
  modalReference: any;
  closeResult: string;
  currentIndex: any;

  constructor(private Rest: RestService, private router: Router, private spinner: NgxSpinnerService, config: NgbModalConfig, private modalService: NgbModal, notifier: NotifierService) {
    this.notifier = notifier;
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
      { label: 'Contest Management', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      // Code here
      this.getContestListAPI();
    }
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  getContestListAPI() {
    const that = this;
    that.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      serverSide: true,
      processing: true,
      ajax: (dataTablesParameters: any, callback) => {
        dataTablesParameters.minNumber = dataTablesParameters.start + 1;
        dataTablesParameters.maxNumber = dataTablesParameters.start + dataTablesParameters.length;
        that.Rest.post('get-contest', dataTablesParameters, this.userDetails.token).subscribe((res: any) => {
          that.contestData = res.data;
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
        { data: "Name" },
        { data: "Type" },
        { data: "Date" },
        { data: "Payout" },
        { data: "Total Winner" },
        { data: "Guranted" },
        { data: "Payout Adjust" },
        { data: "Status" },
      ],
    };
  }

  confirmModalOpen(DialogBoxComponent: any, contestId: any) {
    this.currentContestId = contestId;

    this.modalReference = this.modalService.open(DialogBoxComponent, { centered: true, windowClass: 'DFS-confirmation-modal', size: 'sm' });
    this.modalReference.result.then((result: any) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason: any) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
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
