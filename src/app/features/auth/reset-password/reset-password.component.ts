import { Router } from '@angular/router';
import { AuthService } from './../../../core/services/auth/auth.service';
import { NgClass, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  imports: [NgClass, ReactiveFormsModule, NgIf],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss'
})
export class ResetPasswordComponent {

  processStep: number = 0;
  isLoading: boolean = false;

  constructor(private _AuthService: AuthService, private _Router: Router) { }

  emailForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required])
  })

  codeForm: FormGroup = new FormGroup({
    resetCode: new FormControl(null, [Validators.required])

  })

  passwordForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.email, Validators.required]),
    newPassword: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{5,}$/)]),
  })

  submitEmail() {
    this.isLoading = true;
    this._AuthService.verifyEmailForPassReset(this.emailForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.statusMsg == 'success') {
          Swal.fire({
            color: "#fff",
            background: "#14803d",
            position: "top-end",
            icon: "success",
            title: "Code sent successfully",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            toast: true,
          });
          this.processStep += 1;
        }
      },
      error: (err) => {
        Swal.fire({
          title: "Error",
          text: "Email doesn't exist",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#14803D",
        });
        this.isLoading = false;
        console.log(err);
      }
    })
  }

  submitCode() {
    this.isLoading = true;
    this._AuthService.verifyCodeForPassReset(this.codeForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log(res);
        if (res.status == 'Success') {
          this.processStep += 1;
        }
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: "Error",
          text: "Code is incorrect",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#14803D",
        });
        console.log(err);
      }
    })
  }

  submitPassword() {
    this.isLoading = true;
    this._AuthService.resetPassword(this.passwordForm.value).subscribe({
      next: (res) => {
        this.isLoading = false;
        if (res.token) {
          localStorage.setItem('userToken', res.token);
          this._AuthService.decodeToken();
          this._Router.navigate(['/home']).then(() => {
            window.location.reload();
          });;
        }
      },
      error: (err) => {
        this.isLoading = false;
        Swal.fire({
          title: "Error",
          text: "Email is incorrect",
          icon: "error",
          confirmButtonText: "Ok",
          confirmButtonColor: "#14803D",
        });
        this._Router.navigate(['/resetPassword']);
        console.log(err);
      }
    })
  }
}
