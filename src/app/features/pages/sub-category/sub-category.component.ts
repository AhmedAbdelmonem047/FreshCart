import { CategoriesService } from './../../../core/services/categories/categories.service';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Category } from '../../../shared/interfaces/categories/categories';
import { Location } from '@angular/common';

@Component({
  selector: 'app-sub-category',
  imports: [],
  templateUrl: './sub-category.component.html',
  styleUrl: './sub-category.component.scss'
})
export class SubCategoryComponent {

  catID: string = '';
  subCatList: Category[] = [];

  constructor(private _ActivatedRoute: ActivatedRoute, private _CategoriesService: CategoriesService, private _Location: Location) {
    _ActivatedRoute.params.subscribe(res => {
      this.catID = res['catID'];
      console.log(this.catID);
    })
  }

  ngOnInit(): void {
    this.getAllSubCatForSpecificCat();
  }

  getAllSubCatForSpecificCat() {
    this._CategoriesService.getAllSubCatForSpecificCat(this.catID).subscribe({
      next: (res) => {
        this.subCatList = res.data;
        console.log(this.subCatList);
      },
      error: (err) => {
        console.log(err);
      }
    })
  }

  goBack(): void {
    this._Location.back();
  }

}
