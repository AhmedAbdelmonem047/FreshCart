import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../const/env';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  constructor(private _HttpClient: HttpClient) { }

  getAllCategories(): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/categories`);
  }

  getAllSubCatForSpecificCat(catID: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseURL}/categories/${catID}/subcategories`);
  }
}
