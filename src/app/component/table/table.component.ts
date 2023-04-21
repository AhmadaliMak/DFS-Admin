import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RestService } from '../../service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Product, TopSelling, TableRows, Employee } from './table-data';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-table',
  templateUrl: 'table.component.html'
})
export class TableComponent implements OnInit {
  topSelling: Product[];
  trow: TableRows[];
  productData: any;

  constructor(
    private Rest: RestService,
    private spinner: NgxSpinnerService,
    private notifier: NotifierService,
    private router: Router
  ) {

    this.topSelling = TopSelling;

    this.trow = Employee;
  }

  ngOnInit(): void {
    this.getInvoiceData();
  }

  getInvoiceData() {
    this.spinner.show();
    this.Rest.post('/postedsalesinvoice.php', {}, environment.APIKey).subscribe({
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

  viewInvoice(id: any) {
    this.router.navigateByUrl('component/invoice-details/' + id);
  }
}
