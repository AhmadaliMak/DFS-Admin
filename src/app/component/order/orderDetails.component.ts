import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { RestService } from '../../service/rest.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-order-details',
    templateUrl: 'orderDetails.component.html'
})

export class orderDetailsComponent implements OnInit {

    productData: any;
    routeSub: any;
    orderId: any;

    constructor(
        private Rest: RestService,
        private spinner: NgxSpinnerService,
        private notifier: NotifierService,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        this.routeSub = this.route.params.subscribe(params => {
            this.orderId =params['id']; //log the value of id
        });
        this.getOrderDetailData();
    }

    getOrderDetailData() {
        this.spinner.show();
        this.Rest.post('/postedsalesorderdetail.php', {
            'order_no': this.orderId
        }, environment.APIKey).subscribe({
            next: (res: any) => {
                if (res.status == true) {
                    this.productData = res.data;
                    console.log(this.productData,"productData");
                    
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