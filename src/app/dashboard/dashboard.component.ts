import { Component, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { RestService } from '../../app/service/rest.service';
//declare var require: any;

@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements AfterViewInit {
  subtitle: string;
  constructor(private Rest: RestService, private router: Router) {
    this.subtitle = 'This is some text within a card block.';
  }

  ngOnInit(): void {
    var sessionStorage = this.Rest.getSessionStorage();
    if (sessionStorage == null) {
      this.router.navigate(["login"]);
    }
  }

  ngAfterViewInit() {
  }
}
