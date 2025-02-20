import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../const/env';
import { Checkout } from '../../../shared/interfaces/checkout/checkout';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  token!: any

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) Id: object) {
    if (isPlatformBrowser(Id)) {
      this.token = { token: localStorage.getItem('userToken') || '' };
    }
  }

  getUserOrders(userId: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/orders/user/${userId}`);
  }

  createCashOrder(cartId: string, shippingAddress: Checkout): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/orders/${cartId}`, { shippingAddress: shippingAddress },
      {
        headers: this.token
      })
  }

  gotoCheckoutSession(cartId: string, shippingAddress: Checkout): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/orders/checkout-session/${cartId}?url=http://localhost:4200`, { shippingAddress: shippingAddress },
      {
        headers: this.token
      }
    )
  }
}
