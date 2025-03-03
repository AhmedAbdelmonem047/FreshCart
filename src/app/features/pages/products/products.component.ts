import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { Component } from '@angular/core';
import { Products } from '../../../shared/interfaces/products/products';
import { CurrencyPipe, NgIf, UpperCasePipe } from '@angular/common';
import { FilterPipe } from "../../../shared/pipe/filter.pipe";
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../../core/services/auth/auth.service';
import { Product } from '../../../shared/interfaces/wishlist/wishlist';


@Component({
  selector: 'app-products',
  imports: [CurrencyPipe, UpperCasePipe, FilterPipe, FormsModule, RouterLink, NgIf],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  cart: { productId: string; inCart: boolean; quantity: number }[] = [];
  wishlist: { productId: string; inWishlist: boolean }[] = [];
  productList: Products[] = [];
  searchVal: string = '';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  currentProductId: string = '';
  cartList: any[] = [];
  wishlistItems: Product[] = [];


  constructor(private _ProductsService: ProductsService, private _CartService: CartService, private _AuthService: AuthService, private _WishlistService: WishlistService) {
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    })
  }

  ngOnInit(): void {
    this.getAllProducts();
    if (this.isLoggedIn) {
      this._CartService.getUserCart().subscribe({
        next: (res) => {
          this.cartList = res.data.products;
          const cartItems = this.cartList.map(item => ({
            productId: item.product._id,
            inCart: true,
            quantity: item.count
          }));
          this._CartService.cartState.next(cartItems);
        }
      })
      this._WishlistService.getUserWishlist().subscribe({
        next: (res) => {
          this.wishlistItems = res.data;
          const wishlistData = this.wishlistItems.map(item => ({
            productId: item._id,
            inWishlist: true
          }));
          this._WishlistService.wishlistState.next(wishlistData);
        }
      })
      this._CartService.cartState.subscribe({
        next: (res) => {
          this.cart = res;
        }
      })
      this._WishlistService.wishlistState.subscribe({
        next: (res) => {
          this.wishlist = res;
        }
      })
    }
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
        this.toggleCart(this.currentProductId);
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

  updateProductQuantity(event: Event, productId: string, count: number) {
    event.stopPropagation();
    let quantity: number = this.getProductQuantity(productId);
    if (count > 0) {
      this.currentProductId = productId;
      this.isLoading = true;
      this._CartService.updateProductQuantity(productId, count).subscribe({
        next: (res) => {
          if (count > quantity)
            this.toggleCart(this.currentProductId);
          else
            this.removeProduct(productId);
          this.isLoading = false;
          this.cartList = res.data.products;
          this._CartService.cartTotalItems.next(res.numOfCartItems);
          Swal.fire({
            color: "#fff",
            background: "#14803d",
            position: "top-end",
            icon: "success",
            title: "Cart Updated Succesfully",
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
    else {
      this.removeSpecificItem(productId);
    }
  }

  removeSpecificItem(productId: string) {
    this.currentProductId = productId;
    this.isLoading = true;
    this._CartService.removeSpecificItem(productId).subscribe({
      next: (res) => {
        this.removeProduct(this.currentProductId);
        this.isLoading = false;
        this.cartList = res.data.products;
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Cart Updated Succesfully",
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

  toggleCart(productId: string) {
    this._CartService.toggleCart(productId);
  }

  removeProduct(productId: string) {
    this._CartService.removeProduct(productId);
  }

  isInCart(productId: string): boolean {
    return this._CartService.isInCart(productId);
  }

  getProductQuantity(productId: string): number {
    const product = this.cart.find(item => item.productId === productId);
    return product ? product.quantity : 0;
  }

  addToWishlist(event: Event, productID: string) {
    event.stopPropagation();
    this._WishlistService.addProductToWishlist(productID).subscribe({
      next: (res) => {
        this.toggleWishlist(productID);
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

  removeFromWishlist(event: Event, productID: string) {
    event.stopPropagation();
    this._WishlistService.removeProductFromWishlist(productID).subscribe({
      next: (res) => {
        this.toggleWishlist(productID);
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Product Removed Succesfully",
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

  toggleWishlist(productId: string) {
    this._WishlistService.toggleWishlist(productId);
  }

  isInWishlist(productId: string): boolean {
    return this._WishlistService.isInWishlist(productId);
  }
}
