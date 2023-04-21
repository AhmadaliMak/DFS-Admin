import { Routes } from '@angular/router';
import { NgbdpaginationBasicComponent } from './pagination/pagination.component';
import { NgbdAlertBasicComponent } from './alert/alert.component';

import { NgbdDropdownBasicComponent } from './dropdown-collapse/dropdown-collapse.component';
import { NgbdnavBasicComponent } from './nav/nav.component';
import { BadgeComponent } from './badge/badge.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { CardsComponent } from './card/card.component';
import { TableComponent } from './table/table.component';
import { invoiceDetailsComponent } from './table/invoiceDetails.component';
import { OrderComponent } from './order/order.component';
import { orderDetailsComponent } from './order/orderDetails.component';
import { ShipmentComponent } from './shipment/shipment.component';
import { ShipmentDetailsComponent } from './shipment/shipmentDetails.component';


export const ComponentsRoutes: Routes = [
	{
		path: '',
		children: [
			{
				path: 'invoice',
				component: TableComponent
			},
			{
				path: 'invoice-details/:id',
				component: invoiceDetailsComponent
			},
			{
				path: 'order',
				component: OrderComponent
			},
			{
				path: 'order-details/:id',
				component: orderDetailsComponent
			},
			{
				path: 'shipment',
				component: ShipmentComponent
			},
			{
				path: 'shipment-details/:id',
				component: ShipmentDetailsComponent
			},
			{
				path: 'card',
				component: CardsComponent
			},
			{
				path: 'pagination',
				component: NgbdpaginationBasicComponent
			},
			{
				path: 'badges',
				component: BadgeComponent
			},
			{
				path: 'alert',
				component: NgbdAlertBasicComponent
			},
			{
				path: 'dropdown',
				component: NgbdDropdownBasicComponent
			},
			{
				path: 'nav',
				component: NgbdnavBasicComponent
			},
			{
				path: 'buttons',
				component: ButtonsComponent
			}
		]
	}
];
