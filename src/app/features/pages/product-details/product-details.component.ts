import { CartService } from './../../../core/services/cart/cart.service';
import { AuthService } from './../../../core/services/auth/auth.service';
import { ProductsService } from './../../../core/services/products/products.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Products } from '../../../shared/interfaces/products/products';
import { CurrencyPipe } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-details',
  imports: [CurrencyPipe, CarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.scss'
})
export class ProductDetailsComponent {

  productID: string = '';
  productDetails!: Products;
  isLoggedIn: boolean = false;
  isLoading:boolean = false;

  constructor(private _ActivatedRoute: ActivatedRoute, private _ProductsService: ProductsService, private _AuthService: AuthService, private _CartService: CartService) {
    _ActivatedRoute.params.subscribe(res => {
      this.productID = res['productID']
      console.log(this.productID);
    })
  }

  ngOnInit(): void {
    this.getSpecificProduct();
    this._AuthService?.userData.subscribe({
      next: (res) => {
        if (res !== null)
          this.isLoggedIn = true;
        else
          this.isLoggedIn = false
      }
    })
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
}
