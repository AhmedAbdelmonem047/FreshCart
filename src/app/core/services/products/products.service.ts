import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../const/env';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private _HttpClient: HttpClient) { }

  getAllProducts(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/products`);
  }

  getSpecificProduct(id: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/products/${id}`);
  }

}
