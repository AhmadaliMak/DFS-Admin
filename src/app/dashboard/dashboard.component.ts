import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  breadCrumbItems!: Array<{}>;

  constructor(private Rest: RestService, private router: Router) {
    this.subtitle = 'This is some text within a card block.';
  }

  ngOnInit(): void {
    // BreadCrumb
    this.breadCrumbItems = [
      { label: 'Dashboard' },
      // { label: 'Dashboard', active: true }
    ];
    var sessionStorage = this.Rest.getSessionStorage();
    if (sessionStorage == null) {
      this.router.navigate(["login"]);
    }
  }

  ngAfterViewInit() {
  }
}
