import { Component } from '@angular/core';
import { HomeSliderComponent } from "../home-slider/home-slider.component";
import { CategorySliderComponent } from "../category-slider/category-slider.component";
import { ProductsComponent } from "../products/products.component";

@Component({
  selector: 'app-home',
  imports: [HomeSliderComponent, CategorySliderComponent, ProductsComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
