import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';
import { FormBuilder, Validators, FormGroup, FormArray } from '@angular/forms';

@Component({
  selector: 'app-contest-add-edit',
  templateUrl: './contest-add-edit.component.html',
  styleUrls: ['./contest-add-edit.component.scss']
})
export class ContestAddEditComponent implements OnInit {

  subtitle: string;
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  notifier: NotifierService;
  newToken: any;
  contentId: any;
  contestDetailData: any;
  contestForm!: FormGroup;
  submitted: boolean = false;
  URLContestId: any;
  pageTitle: any;
  gameListData: any;
  selectedGame: any;

  constructor(private Rest: RestService, private router: Router, private activateRouter: ActivatedRoute, private spinner: NgxSpinnerService, notifier: NotifierService, public formBuilder: FormBuilder) {
    this.notifier = notifier;
  }

  ngOnInit(): void {
    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    this.URLContestId = this.activateRouter.snapshot.paramMap.get('contestId');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.contestForm = this.formBuilder.group({
        sportsId: ['', Validators.required],
        gameId: ['', Validators.required],
        name: ['', Validators.required],
        total_entry: ['', Validators.required],
        user_max_entry: ['', Validators.required],
        entry_fees: ['', Validators.required],
        payout: ['', Validators.required],
        isguranted: ['', Validators.required],
        winning_price: this.formBuilder.array([]),
      });
      this.getGame();
      // BreadCrumb
      if (this.URLContestId) {
        this.breadCrumbItems = [
          { label: 'Contest Management' },
          { label: 'Edit Contest', active: true }
        ];
        this.pageTitle = 'Edit Contest';
        this.getContestDetail();
      } else {
        this.breadCrumbItems = [
          { label: 'Contest Management' },
          { label: 'Add Contest', active: true }
        ];
        this.pageTitle = 'Add Contest';
        this.addWinningPrice();
      }
    }
  }

  winningPrice(): FormArray {
    return this.contestForm.get("winning_price") as FormArray;
  }

  newWinningPrice(): FormGroup {
    return this.formBuilder.group({
      rank: ['', Validators.required],
      price: ['', Validators.required],
    })
  }

  addWinningPrice() {
    this.winningPrice().push(this.newWinningPrice());
  }

  removeWinningPrice(i: number) {
    this.winningPrice().removeAt(i);
  }

  // getRefreshToken() {
  //   this.Rest.refrshToken(this.userDetails.token).subscribe(
  //     (res: any) => {
  //       this.newToken = res.data.token;
  //     });
  // }

  getContestDetail() {
    this.spinner.show();
    this.Rest.get(`get-contest-details/${this.URLContestId}`, this.userDetails?.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.contestDetailData = res.data;
          this.changeSport(this.contestDetailData?.sportsId, 'edit');
          this.contestForm.patchValue({
            sportsId: this.contestDetailData.sportsId,
            gameId: this.contestDetailData.gameId,
            name: this.contestDetailData.name,
            total_entry: this.contestDetailData.total_entry,
            user_max_entry: this.contestDetailData.max_user,
            entry_fees: this.contestDetailData.fees,
            payout: this.contestDetailData.payout,
            isguranted: this.contestDetailData.guranted == '1' ? true : false,
          });
          this.contestDetailData?.winning?.forEach((element: any) => {
            let rows = this.contestForm.get('winning_price') as FormArray;
            rows.push(this.formBuilder.group({
              rank: [element.rank],
              price: [element.price],
            }))
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

  getGame() {
    this.spinner.show()
    this.Rest.get(`get-matchs`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.gameListData = res.data;
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

  numberOnly(event: any, type: any): any {
    if (type == 'num') {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode != 46) {
        return false;
      }
      return true;
    } else {
      const charCode = (event.which) ? event.which : event.keyCode;
      if (charCode > 31 && (charCode < 48 || charCode > 57) && charCode !== 45) {
        return false;
      }
      return true;
    }
  }

  changeSport(event: any, type: any) {
    let typeD: any;
    if (type == 'change') {
      typeD = event?.target?.value;
    } else {
      typeD = event;
    }
    setTimeout(() => {
      var gameData = this.gameListData.find((x: any) => x._id == typeD);
      this.selectedGame = gameData?.match__list;
    }, 500);
  }

  get f() { return this.contestForm.controls; }

  onSubmit(status: any) {
    this.submitted = true;
    var contestFormValue = this.contestForm.getRawValue();
    if (this.contestForm.valid) {
      this.spinner.show();
      if (this.URLContestId) {
        this.editSubmit(contestFormValue, status);
      } else {
        this.addSubmit(contestFormValue, status);
      }
    }
  }

  addSubmit(formVal: any, status: any) {
    console.log(formVal);
    this.Rest.post('add-contest', {
      'sportsId': formVal.sportsId,
      'gameId': formVal.gameId,
      'name': formVal.name,
      'total_entry': formVal.total_entry,
      'user_max_entry': formVal.user_max_entry,
      'entry_fees': formVal.entry_fees,
      'payout': formVal.payout,
      'winning_price': formVal.winning_price,
      'publish': status,
      'isguranted': formVal.isguranted == true ? 1 : 0
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', res.msg);
          this.spinner.hide();
          this.router.navigate(["contest-list"]);
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

  editSubmit(formVal: any, status: any) {
    this.Rest.post('update-contest', {
      'contestId': this.URLContestId,
      'name': formVal.name,
      'total_entry': formVal.total_entry,
      'user_max_entry': formVal.user_max_entry,
      'entry_fees': formVal.entry_fees,
      'payout': formVal.payout,
      'winning_price': formVal.winning_price,
      'publish': status,
      'isguranted': formVal.isguranted == true ? 1 : 0
    }, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.notifier.notify('success', res.msg);
          this.spinner.hide();
          this.router.navigate(["contest-list"]);
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

  backToList(){
    this.router.navigate(["contest-list"]);
  }

}
