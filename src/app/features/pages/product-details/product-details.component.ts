import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { CartService } from './../../../core/services/cart/cart.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../../shared/interfaces/products/products';
import { CurrencyPipe, NgIf } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Product } from '../../../shared/interfaces/wishlist/wishlist';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, CarouselModule, NgIf],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  productID: string = '';
  productDetails!: Products;
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  cartList: any[] = [];
  wishlistItems: Product[] = [];
  totalItems: number = 0;

  constructor(private _ActivatedRoute: ActivatedRoute, private _ProductsService: ProductsService, private _AuthService: AuthService, private _CartService: CartService,
    private _WishlistService: WishlistService, private cdr: ChangeDetectorRef, private ngZone: NgZone, private _Location: Location) {
    _ActivatedRoute.params.subscribe(res => {
      this.productID = res['productID']
      console.log(this.productID);
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
        }
      });
      this._WishlistService.getUserWishlist().subscribe({
        next: (res) => {
          this.wishlistItems = res.data;
        }
      });
    }
  }

  reloadComponent() {
    // this.ngZone.runOutsideAngular(() => {
    //   location.reload();
    // });
  }

  getSpecificProduct() {
    this._ProductsService.getSpecificProduct(this.productID).subscribe({
      next: (res => {
        this.productDetails = res.data;
        console.log(this.productDetails);
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
        this._CartService.cartTotalItems.next(res.numOfCartItems);
        this.isLoading = false;
        console.log(res);
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
    this.reloadComponent()
  }

  isProductInCart(productId: string) {
    if (this.isLoggedIn) {
      let flag = this.cartList.find(product => product.product._id === productId);
      if (flag)
        return true
      else
        return false
    }
    return false
  }

  getProductCount(productID: string) {
    if (this.isLoggedIn) {
      let flag = this.cartList.find(product => product.product._id === productID);
      if (flag)
        return flag.count
      else
        return 0
    }
    return 0
  }

  updateProductQuantity(event: Event, productId: string, count: number) {
    event.stopPropagation();
    if (count > 0) {
      this.isLoading = true;
      this._CartService.updateProductQuantity(productId, count).subscribe({
        next: (res) => {
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
          console.log(res);
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
    this.cdr.detectChanges();
  }

  removeSpecificItem(productId: string) {
    this.isLoading = true;
    this._CartService.removeSpecificItem(productId).subscribe({
      next: (res) => {
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

  isProductInWishlist(productId: string) {
    if (this.isLoggedIn) {
      let flag = this.wishlistItems.find(product => product._id === productId);
      if (flag)
        return true
      else
        return false
    }
    return false
  }

  addToWishlist(event: Event, productID: string) {
    event.stopPropagation();
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
    this.reloadComponent();
  }

  removeFromWishlist(event: Event, productID: string) {
    event.stopPropagation();
    this._WishlistService.removeProductFromWishlist(productID).subscribe({
      next: (res) => {
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
    this.reloadComponent();
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
