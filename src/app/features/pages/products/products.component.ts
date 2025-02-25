import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { Component } from '@angular/core';
import { Products } from '../../../shared/interfaces/products/products';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { FilterPipe } from "../../../shared/pipe/filter.pipe";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Cart } from '../../../shared/interfaces/cart/cart';

@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, UpperCasePipe, FilterPipe, FormsModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {
  constructor(private _ProductsService: ProductsService, private _CartService: CartService, private _AuthService: AuthService, private _WishlistService: WishlistService) { }

  productList: Products[] = [];
  searchVal: string = '';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  currentProductId: string = '';

  ngOnInit(): void {
    this.getAllProducts();
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    })
  }

  getAllProducts() {
    this.isLoading = true;
    this._ProductsService.getAllProducts().subscribe({
      next: (res) => {
        this.isLoading = false;
        this.productList = res.data;
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);

      }
    })
  }

  addToCart(event: Event, productID: string) {
    this.isLoading = true;
    this.currentProductId = productID;
    event.stopPropagation();
    this._CartService.addProductToCart(productID).subscribe({
      next: (res) => {
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        this.isLoading = false;
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
        this.isLoading = false;
        console.log(err);
      }
    });
  }

  addToWishlist(event: Event, productID: string) {
    event.stopPropagation();
    console.log('hi', productID);
    this._WishlistService.addProductToWishlist(productID).subscribe({
      next: (res) => {
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Product Added Succesfully",
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
    })
  }
}
