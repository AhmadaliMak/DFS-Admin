import { Component, OnInit } from '@angular/core';
import { RestService } from '../service/rest.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { NotifierService } from 'angular-notifier';

@Component({
  selector: 'app-contest-detail',
  templateUrl: './contest-detail.component.html',
  styleUrls: ['./contest-detail.component.scss']
})
export class ContestDetailComponent implements OnInit {
  breadCrumbItems!: Array<{}>;
  userDetails: any;
  contentId: any;
  contentData: any;
  gameListData: any;

  constructor(
    private Rest: RestService,
    private router: Router,
    private activateRouter: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService
  ) { }

  ngOnInit(): void {
    this.breadCrumbItems = [
      { label: 'Content Management' },
      { label: 'Content Details', active: true }
    ];

    this.userDetails = JSON.parse(this.Rest.getSessionStorage() || '');
    if (this.userDetails == null) {
      this.router.navigate(["login"]);
    } else {
      this.contentId = this.activateRouter.snapshot.paramMap.get('contestId');
      this.getGame();
      this.getContentDetail();
    }
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

  getContentDetail(){
    this.spinner.show();
    this.Rest.get(`get-contest-details/${this.contentId}`, this.userDetails.token).subscribe({
      next: (res: any) => {
        if (res.status == 200) {
          this.contentData = res.data;
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

  getSportName(sportId: any){
    let sportName = '';
    this.gameListData?.forEach((element: any) => {
      if(element._id == sportId){
        sportName = element.name;
      }
    });
    return sportName;
  }

  getGameName(sportId: any, gameId: any){
    let gameName = '';
    this.gameListData?.forEach((element: any) => {
      if(element._id == sportId){
        element?.match__list?.forEach((data: any) => {
          if(data?.gameId == gameId){
            gameName = data?.match_type + ' (' + data?.date + ')';
          }
        });
      }
    });
    return gameName;
  }

  onSubmit(){
    this.router.navigate(["contest-list"]);
  }

}
