import { CategoriesService } from './../../../core/services/categories/categories.service';
import { Component } from '@angular/core';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { Categories } from '../../../shared/interfaces/categories/categories';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-category-slider',
  imports: [CarouselModule],
  templateUrl: './category-slider.component.html',
  styleUrl: './category-slider.component.scss'
})
export class CategorySliderComponent {

  constructor(private _CategoriesService: CategoriesService) { }

  categoryList: Categories[] = [];

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res => {
        this.categoryList = res.data;
      }),
      error: (err => {
        console.log(err);
      })
    })
  }

  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    autoplay: true,
    dots: false,
    navSpeed: 700,
    navText: [
      '<i class="fa fa-angle-left"></i>',
      '<i class="fa fa-angle-right"></i>'
    ],
    responsive: {
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 5
      },
      1200: {
        items: 7
      }
    },
    nav: true
  }
}
