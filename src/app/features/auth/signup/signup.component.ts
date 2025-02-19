import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-signup',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {

  constructor(private _AuthService: AuthService, private router: Router) { }

  isLoading: boolean = false;

  signupForm: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.minLength(3), Validators.required]),
    email: new FormControl(null, [Validators.email, Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.pattern(/^[A-Z]\w{5,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.pattern(/^01[0125][0-9]{8}$/), Validators.required]),
  }, { validators: this.confirmPassword })

  confirmPassword(group: AbstractControl) {
    const password = group.get('password')?.value;
    const rePassword = group.get('rePassword')?.value;

    if (password === rePassword)
      return null
    else
      return { mismatch: true }
  }

  submitForm() {
    this.isLoading = true;
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      this.isLoading = false;
    }
    else {
      this._AuthService.signup(this.signupForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          if (res.message == 'success') {
            this.displayPopup('Success', 'Account Created Successfully', 'success');
            this.router.navigate(['/login']);
          }
        },
        error: (err) => {
          this.isLoading = false;
          if (err.error.message == "fail") {
            if (err.error.errors.param == 'name') {
              this.displayPopup('Error', 'Name must be at least 3 chars long', 'error');
            }
            else if (err.error.errors.param == 'email') {
              if (err.error.errors.value == '')
                this.displayPopup('Error', 'Email is required', 'error');
              else
                this.displayPopup('Error', 'Invalid Email', 'error');
            }
            else if (err.error.errors.param == 'password') {
              if (err.error.errors.value == '')
                this.displayPopup('Error', 'Password is required', 'error');
              else
                this.displayPopup('Error', 'Password must be at least 3 chars long', 'error');
            }
            else if (err.error.errors.param == 'rePassword') {

            }
            else if (err.error.errors.param == 'phone') {
              this.displayPopup('Error', 'Only works with egyptian phone numbers', 'error');
            }
          }
          else {
            this.displayPopup('Error', 'Account Already Exists', 'error');
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
