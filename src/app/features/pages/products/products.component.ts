import { WishlistService } from './../../../core/services/wishlist/wishlist.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { ChangeDetectorRef, Component, NgZone } from '@angular/core';
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
  constructor(private _ProductsService: ProductsService, private _CartService: CartService, private _AuthService: AuthService,
    private _WishlistService: WishlistService, private cdr: ChangeDetectorRef, private ngZone: NgZone) {
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    })
  }

  productList: Products[] = [];
  searchVal: string = '';
  isLoggedIn: boolean = false;
  isLoading: boolean = false;
  currentProductId: string = '';
  cartList: any[] = [];
  wishlistItems: Product[] = [];
  totalItems: number = 0;

  ngOnInit(): void {
    this.getAllProducts();
    if (this.isLoggedIn) {
      this._CartService.getUserCart().subscribe({
        next: (res) => {
          this.cartList = res.data.products;
        }
      })
      this._WishlistService.getUserWishlist().subscribe({
        next: (res) => {
          this.wishlistItems = res.data;
        }
      })
    }
  }

  reloadComponent() {
    this.ngZone.runOutsideAngular(() => {
      location.reload();
    });
    this.cdr.detectChanges();
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
        console.log(res);

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
    this.reloadComponent();
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
      this.currentProductId = productId;
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
    this.currentProductId = productId;
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
}
