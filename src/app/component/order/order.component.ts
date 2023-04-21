import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RestService } from '../../service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-order',
  templateUrl: 'order.component.html'
})
export class OrderComponent implements OnInit {

  productData: any = [];

  constructor(
    private Rest: RestService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.getOrderData();
  }

  getOrderData() {
    this.spinner.show();
    this.Rest.post('/postedsalesorder.php', {}, environment.APIKey).subscribe({
      next: (res: any) => {
        if (res.status == true) {
          this.productData = res.data;
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

  viewOrder(id: any) {
    this.router.navigateByUrl('component/order-details/' + id);
  }
}
