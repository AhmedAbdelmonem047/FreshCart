import { CartService } from './../../../core/services/cart/cart.service';
import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { Component } from '@angular/core';
import { Product } from '../../../shared/interfaces/wishlist/wishlist';
import { CurrencyPipe, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-wishlist',
  imports: [CurrencyPipe, NgIf],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  constructor(private _WishlistService: WishlistService, private _CartService: CartService) { }

  totalItems: number = 0;
  wishlistItems: Product[] = [];

  ngOnInit(): void {
    this.getUserWishlist();
  }

  getUserWishlist() {
    this._WishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.totalItems = res.count;
        this.wishlistItems = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addProductToWishlist(productId: string) {
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        this.totalItems = res.count;
        this.wishlistItems = res.data;
        this.getUserWishlist();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addProductToCart(productId: string) {
   this._CartService.addProductToCart(productId).subscribe({
      next: (res) => {
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        this.removeProductFromWishlist(productId);
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Product Added Successfully",
          showCloseButton: true,
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
          toast: true,
        });
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  removeProductFromWishlist(productId: string) {
    this._WishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        this.totalItems = res.count;
        this.wishlistItems = res.data;
        this.getUserWishlist();
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
