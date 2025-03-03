import { CurrencyPipe } from '@angular/common';
import { Cart } from '../../../shared/interfaces/cart/cart';
import { CartService } from './../../../core/services/cart/cart.service';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  imports: [CurrencyPipe, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent {

  constructor(private _CartService: CartService) { }

  totalItems: number = 0;
  totalPrice: number = 0;
  cartList: Cart[] = [];
  cartId: string = '';
  isLoading: boolean = false;
  currentProductId: string = '';

  ngOnInit(): void {
    this.getUserCart()
    if (localStorage.getItem('payment') == 'failure') {
      Swal.fire({
        title: "Error",
        text: "Something Went Wrong",
        icon: "error",
        confirmButtonText: "Ok",
        confirmButtonColor: "#14803D",
      })
      localStorage.removeItem('payment');
    }
  }

  getUserCart() {
    this._CartService.getUserCart().subscribe({
      next: (res) => {
        this.totalItems = res.numOfCartItems;
        this.totalPrice = res.data.totalCartPrice;
        this.cartList = res.data.products;
        this.cartId = res.cartId;
        this._CartService.cartTotalItems.next(res.numOfCartItems);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  removeSpecificItem(productId: string) {
    this.currentProductId = productId;
    this.isLoading = true;
    this._CartService.removeSpecificItem(productId).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.totalItems = res.numOfCartItems;
        this.totalPrice = res.data.totalCartPrice;
        this.cartList = res.data.products;
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Cart Updated Succesfully",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
        });
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  updateProductQuantity(productId: string, count: number) {
    if (count > 0) {
      this.currentProductId = productId;
      this.isLoading = true;
      this._CartService.updateProductQuantity(productId, count).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.totalItems = res.numOfCartItems;
          this.totalPrice = res.data.totalCartPrice;
          this.cartList = res.data.products;
          this._CartService.cartTotalItems.next(res.numOfCartItems);
          Swal.fire({
            color: "#fff",
            background: "#14803d",
            position: "top-end",
            icon: "success",
            title: "Cart Updated Succesfully",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            toast: true,
          });
        },
        error: (err) => {
          this.isLoading = false;
          console.log(err);
        }
      });
    }
    else {
      this.removeSpecificItem(productId);
    }
  }

  clearCart() {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#14803d",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Clear it!"
    }).then((result) => {
      if (result.isConfirmed) {
        this._CartService.clearCart().subscribe({
          next: (res) => {
            this.currentProductId = '';
            this.getUserCart();
          },
          error: (err) => {
            console.log(err);
          }
        })
        Swal.fire({
          title: "Cleared!",
          text: "Your cart has been cleared.",
          icon: "success",
          confirmButtonColor: "#14803D",
        });
      }
    });
  }
}

