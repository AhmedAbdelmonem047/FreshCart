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
  // cartState = new BehaviorSubject<{ productId: string; inCart: boolean }[]>([]);
  cartState = new BehaviorSubject<{ productId: string; inCart: boolean; quantity: number }[]>([]);

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) Id: object) {
    if (isPlatformBrowser(Id)) {
      this.token = { token: localStorage.getItem('userToken') || '' };
      this.getUserCart().subscribe({
        next: (res) => {
          this.cartTotalItems.next(res.numOfCartItems);
          // const cartItems = res.map((item: { productId: any; }) => ({
          //   productId: item.productId,
          //   isInCart: true 
          // }));
          // this.cartState.next(cartItems);
        }
      })
    }
  }

  addProductToCart(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/cart`, { productId: productId })
  }

  updateProductQuantity(productId: string, count: number): Observable<any> {
    return this._HttpClient.put(`${environment.baseURL}/cart/${productId}`, { count: count })
  }

  getUserCart(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/cart`)
  }
  removeSpecificItem(productId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/cart/${productId}`)
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/cart`)
  }

  toggleCart(productId: string) {
    let currentCart = this.cartState.value;
    const index = currentCart.findIndex(item => item.productId === productId);

    if (index !== -1)
      currentCart[index].quantity += 1;
    else
      currentCart = [...currentCart, { productId, inCart: true, quantity: 1 }];


    this.cartState.next(currentCart);
  }

  removeProduct(productId: string) {
    let currentCart = this.cartState.value;
    const index = currentCart.findIndex(item => item.productId === productId);

    if (index !== -1) {
      if (currentCart[index].quantity > 1)
        currentCart[index].quantity -= 1;
      else
        currentCart.splice(index, 1);
    }

    this.cartState.next(currentCart);
  }

  isInCart(productId: string): boolean {
    return this.cartState.value.some(item => item.productId === productId && item.inCart);
  }
}
