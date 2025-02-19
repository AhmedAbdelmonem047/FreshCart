import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../const/env';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  token!: any;
  cartTotalItems: BehaviorSubject<any> = new BehaviorSubject<any>(0);

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) Id: object) {
    if (isPlatformBrowser(Id)) {
      this.token = { token: localStorage.getItem('userToken') || '' };
    }
    this.getUserCart().subscribe({
      next: (res) => {
        this.cartTotalItems.next(res.numOfCartItems);
      }
    })
  }

  addProductToCart(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/cart`, { productId: productId },
      {
        headers: this.token
      })
  }

  updateProductQuantity(productId: string, count: number): Observable<any> {
    return this._HttpClient.put(`${environment.baseURL}/cart/${productId}`, { count: count },
      {
        headers: this.token
      })
  }

  getUserCart(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/cart`,
      {
        headers: this.token
      })
  }
  removeSpecificItem(productId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/cart/${productId}`,
      {
        headers: this.token
      })
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/cart`,
      {
        headers: this.token
      })
  }
}
