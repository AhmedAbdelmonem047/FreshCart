import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth/auth.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private _AuthService: AuthService, private router: Router) { }

  isLoading: boolean = false;

  loginForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required]),
  })

  submitForm() {
    this.isLoading = true;
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.isLoading = false;
    }
    else {
      this._AuthService.login(this.loginForm.value).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          if (res.message == 'success') {
            localStorage.setItem('userToken', res.token);
            this._AuthService.decodeToken();
            this.router.navigate(['/home']).then(() => {
              window.location.reload();
            });
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error.message == "fail") {
            if (err.error.errors.param == 'email') {
              if (err.error.errors.value == '')
                this.displayPopup('Error', 'Email is required', 'error');
              else
                this.displayPopup('Error', 'Invalid Email', 'error');
            }
            else if (err.error.errors.param == 'password') {
              if (err.error.errors.value == '')
                this.displayPopup('Error', 'Password is required', 'error');
            }
          }
          else {
            this.displayPopup('Error', 'Incorrect email or password', 'error');
          }
        }
      })
    }
  }

  displayPopup(titleVal: string, textVal: string, iconVal: any) {
    Swal.fire({
      title: titleVal,
      text: textVal,
      icon: iconVal,
      confirmButtonText: "Ok",
      confirmButtonColor: "#14803D",
    });
  }
}
