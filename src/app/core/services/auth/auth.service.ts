import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Auth } from '../../../shared/interfaces/auth/auth';
import { jwtDecode, JwtPayload } from "jwt-decode";
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../../const/env';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private _HttpClient: HttpClient, @Inject(PLATFORM_ID) Id: object, private _Router: Router) {
    if (isPlatformBrowser(Id)) {
      if (localStorage.getItem('userToken') !== null)
        this.decodeToken();
    }
  }

  userData: BehaviorSubject<null | JwtPayload> = new BehaviorSubject<null | JwtPayload>(null);

  signup(formData: Auth): Observable<any> {
    return this._HttpClient.post(`${environment.baseURL}/auth/signup`, formData);
  }

  login(formData: Auth) {
    return this._HttpClient.post(`${environment.baseURL}/auth/signin`, formData);
  }

  logout() {
    localStorage.removeItem('userToken');
    this.userData.next(null);
    this._Router.navigate(['/login']).then(() => {
      window.location.reload();
    });
  }

  decodeToken() {
    const token = localStorage.getItem('userToken') || '';
    const decoded = jwtDecode(token);
    this.userData.next(decoded);
  }
}
