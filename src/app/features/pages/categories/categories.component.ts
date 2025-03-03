import { RouterLink } from '@angular/router';
import { Category } from '../../../shared/interfaces/categories/categories';
import { CategoriesService } from './../../../core/services/categories/categories.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-categories',
  imports: [RouterLink],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  catList: Category[] = [];

  constructor(private _CategoriesService: CategoriesService) { }

  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this._CategoriesService.getAllCategories().subscribe({
      next: (res) => {
        this.catList = res.data;
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

}
