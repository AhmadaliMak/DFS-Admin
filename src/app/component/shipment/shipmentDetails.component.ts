import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RestService } from '../../service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { environment } from '../../../environments/environment';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-shipment-details',
    templateUrl: 'shipmentDetails.component.html'
})

export class ShipmentDetailsComponent implements OnInit {
    productData: any;
    routeSub: any;
    invoiceId: any;

    constructor(
        private Rest: RestService,
        private spinner: NgxSpinnerService,
        private notifier: NotifierService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            this.invoiceId =params['id']; //log the value of id
        });
        this.getInvoiceDetailData();
    }

    getInvoiceDetailData() {
        this.spinner.show();
        this.Rest.post('/postedsalesshipmentdetail.php', {
            'shipment_no': this.invoiceId
        }, environment.APIKey).subscribe({
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
}