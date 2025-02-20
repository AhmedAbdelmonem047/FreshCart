import { count } from 'console';
import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-wishlist',
  imports: [],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent {

  constructor(private _WishlistService: WishlistService) { }

  totalItems: number = 0;

  ngOnInit(): void {
    this.getUserWishlist();
  }

  getUserWishlist() {
    this._WishlistService.getUserWishlist().subscribe({
      next: (res) => {
        this.totalItems = res.count;
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  addProductToWishlist(productId: string) {
    this._WishlistService.addProductToWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  removeProductFromWishlist(productId: string) {
    this._WishlistService.removeProductFromWishlist(productId).subscribe({
      next: (res) => {
        console.log(res);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
