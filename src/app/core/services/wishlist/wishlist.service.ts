import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../const/env';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  token!: any;

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) Id: object) {
    if (isPlatformBrowser(Id)) {
      this.token = { token: localStorage.getItem('userToken') || '' };
    }
  }


  getUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/wishlist`)
  }

  addProductToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/wishlist`, { productId: productId })
  }

  removeProductFromWishlist(productId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseURL}/wishlist/${productId}`)
  }
}
