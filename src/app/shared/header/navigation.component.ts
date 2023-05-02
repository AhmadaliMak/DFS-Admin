import { Component, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { RestService } from '../../../app/service/rest.service';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Router } from '@angular/router';

declare var $: any;

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html'
})
export class NavigationComponent implements AfterViewInit {
  @Output() toggleSidebar = new EventEmitter<void>();

  public config: PerfectScrollbarConfigInterface = {};

  public showSearch = false;
  userDetail: any;

  constructor(private Rest: RestService,  private router: Router) {
  }

  ngOnInit(): void {
    var user = this.Rest.getSessionStorage();
    if (user != null) {
      this.userDetail = JSON.parse(user || '');
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(["login"]);
  }

  ngAfterViewInit() { }
}
