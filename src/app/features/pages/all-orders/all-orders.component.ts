import { error } from 'console';
import { AuthService } from './../../../core/services/auth/auth.service';
import { CheckoutService } from './../../../core/services/checkout/checkout.service';
import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { Order } from '../../../shared/interfaces/order/order';
import { CurrencyPipe, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-all-orders',
  imports: [NgIf, CurrencyPipe, RouterLink],
  templateUrl: './all-orders.component.html',
  styleUrl: './all-orders.component.scss'
})
export class AllOrdersComponent {

  userId!: string;
  orderList: Order[] = [];

  constructor(private _CheckoutService: CheckoutService, private _AuthService: AuthService) {
    let response!: any;
    this._AuthService.userData.subscribe({
      next: (res) => {
        response = res;
        this.userId = response.id;
      }
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('payment') == 'success') {
      Swal.fire({
        title: "Success",
        text: "Order Created Successfully",
        icon: "success",
        confirmButtonText: "Ok",
        confirmButtonColor: "#14803D",
      })
      localStorage.removeItem('payment');
    }
    this._CheckoutService.getUserOrders(this.userId).subscribe({
      next: (res) => {
        this.orderList = res;
        this.orderList = this.orderList.reverse();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
