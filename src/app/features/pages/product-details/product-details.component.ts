import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { CartService } from './../../../core/services/cart/cart.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../../shared/interfaces/products/products';
import { CurrencyPipe, NgIf, Location } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../../../shared/interfaces/wishlist/wishlist';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, CarouselModule, NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  cart: { productId: string; inCart: boolean; quantity: number }[] = [];
  wishlist: { productId: string; inWishlist: boolean }[] = [];
  productID: string = '';
  productDetails!: Products;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  cartList: any[] = [];
  wishlistItems: Product[] = [];
  totalItems: number = 0;

  constructor(private _ActivatedRoute: ActivatedRoute, private _ProductsService: ProductsService, private _AuthService: AuthService, private _CartService: CartService,
    private _WishlistService: WishlistService, private _Location: Location) {
    this._ActivatedRoute.params.subscribe(res => {
      this.productID = res['productID']
    });
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    });
  }

  ngOnInit(): void {
    this.getSpecificProduct();
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


  getSpecificProduct() {
    this._ProductsService.getSpecificProduct(this.productID).subscribe({
      next: (res => {
        this.productDetails = res.data;
      }),
      error: (err => {
        console.log(err);
      })
    });
  }

  addToCart(productID: string) {
    this.isLoading = true;
    this._CartService.addProductToCart(productID).subscribe({
      next: (res) => {
        this.toggleCart(this.productID);
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        this.isLoading = false;
        Swal.fire({
          color: "#fff",
          background: "#14803d",
          position: "top-end",
          icon: "success",
          title: "Product Added Succesfully",
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
    if (count > 0) {
      this.isLoading = true;
      let quantity: number = this.getProductQuantity(productId);
      this._CartService.updateProductQuantity(productId, count).subscribe({
        next: (res) => {
          if (count > quantity)
            this.toggleCart(productId);
          else
            this.removeProduct(productId);
          this.isLoading = false;
          this.totalItems = res.numOfCartItems;
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
    this.isLoading = true;
    this._CartService.removeSpecificItem(productId).subscribe({
      next: (res) => {
        this.removeProduct(this.productID);
        this.isLoading = false;
        this.totalItems = res.numOfCartItems;
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

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-angle-left"></i>',
      '<i class="fa fa-angle-right"></i>'
    ],
    responsive: {
      0: {
        items: 1
      }
    },
    nav: true
  }

  goBack(): void {
    this._Location.back();
  }

}
