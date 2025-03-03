import { CartService } from './../../../core/services/cart/cart.service';
import { CheckoutService } from './../../../core/services/checkout/checkout.service';
import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-checkout',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './checkout.component.html',
  styleUrl: './checkout.component.scss'
})
export class CheckoutComponent {

  cartId: string = '';
  isLoading: boolean = false;

  constructor(private _CheckoutService: CheckoutService, private router: Router, private _ActivatedRoute: ActivatedRoute, private _CartService: CartService) {
    _ActivatedRoute.params.subscribe(res => {
      this.cartId = res['cartId']
    })
  }

  checkoutForm: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [Validators.pattern(/^01[0125][0-9]{8}$/), Validators.required]),
    city: new FormControl(null, [Validators.required]),
    paymentMethod: new FormControl(null, [Validators.required])
  })

  submitForm() {
    this.isLoading = true;
    if (this.checkoutForm.invalid) {
      this.isLoading = false;
      this.checkoutForm.markAllAsTouched();
    }
    else {
      if (this.checkoutForm.value.paymentMethod === 'onlinePayment') {
        this._CheckoutService.gotoCheckoutSession(this.cartId, this.checkoutForm.value).subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.status == "success") {
              localStorage.setItem('payment', 'success');
              const paymentURL = `${res.session.url}`;
              window.location.href = paymentURL;
            }
            else {
              localStorage.setItem('payment', 'failure');
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.log(err);
          }
        })
      }
      else {
        this._CheckoutService.createCashOrder(this.cartId, this.checkoutForm.value).subscribe({
          next: (res) => {
            this.isLoading = false;
            if (res.status == "success") {
              Swal.fire({
                title: "Success",
                text: "Order Created Successfully",
                icon: "success",
                confirmButtonText: "Ok",
                confirmButtonColor: "#14803D",
              });
              this._CartService.cartTotalItems.next(0);
              this.router.navigate(['/allorders']);
            }
          },
          error: (err) => {
            this.isLoading = false;
            console.log(err);
          }
        })
      }
    }
  }
}
