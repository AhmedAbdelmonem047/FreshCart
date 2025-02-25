import { Brand } from '../../../shared/interfaces/brands/brands';
import { BrandsService } from './../../../core/services/brands/brands.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-brands',
  imports: [],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {

  brandsList: Brand[] = [];

  constructor(private _BrandsService: BrandsService) { }

  ngOnInit(): void {
    this.getAllBrands();
  }

  getAllBrands() {
    this._BrandsService.getAllBrands().subscribe({
      next: (res) => {
        this.brandsList = res.data;
        console.log(this.brandsList);

      },
      error: (err) => {
        console.log(err);
      }
    })
  }
}
